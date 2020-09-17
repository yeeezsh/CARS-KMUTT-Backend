import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { AreaBuilding } from 'src/area/interfaces/area.building.interface';
import { AreaDoc } from 'src/area/interfaces/area.interface';
import { CreateTaskMeetingDto, TimeSlot } from './dtos/task.meeting.dto';
import { TaskDesc } from './interfaces/task.desc.interface';
import {
  Task,
  TaskDoc,
  TaskLastCard,
  TaskStateType,
  TaskType,
} from './interfaces/task.interface';
// import { AreaQueryService } from 'src/area/area.query.service';
import { QuickTaskAPI } from './interfaces/task.quick.interface';
import { TaskRequestor } from './interfaces/task.requestor.interface';
import { TaskUtilsService } from './task.utils.service';

// constant
// const FORMAT = 'DD-MM-YYYY-HH:mm:ss';
// const TIME_FORMAT = 'HH:mm:ss';
// const DAY_FORMAT = 'DD-MM-YYYY';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
    @Inject('AREA_MODEL') private readonly areaModel: Model<AreaDoc>,
    @Inject('AREA_BUILDING_MODEL')
    private readonly areaBuildingModel: Model<AreaBuilding>,
    private readonly taskUtils: TaskUtilsService,
  ) {}

  private async validMeetingReservation(
    areaId: Types.ObjectId | string,
    time: TimeSlot[],
    sessions: ClientSession,
  ): Promise<boolean> {
    try {
      const startTime = new Date(time[0].start);
      const stopTime = new Date(time[0].stop);
      const tasks = await this.taskModel
        .find({
          area: areaId,
          state: {
            $in: ['accept', 'wait', 'requested'],
            $nin: ['drop'],
          },
          reserve: {
            $elemMatch: {
              allDay: false,
              start: startTime,
              stop: stopTime,
            },
          },
        })
        .countDocuments()
        .session(sessions);
      if (tasks > 0) {
        throw new Error('duplicated tasks');
      }
      return true;
    } catch {
      throw new BadRequestException('task time duplicated');
    }
  }

  async createMeetingTask(
    data: CreateTaskMeetingDto,
    type: TaskType.meetingRoom | TaskType.meetingClub,
    owner: string,
    staff?: boolean,
  ) {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();

      const { area: areaId, time, forms } = data;

      const area: AreaDoc = await this.areaModel
        .findById(areaId)
        .select(['reserve', 'required'])
        .session(s)
        .lean();
      if (!area) throw new BadRequestException('bad area id');

      await this.validMeetingReservation(areaId, time, s);

      const requestorMapped: TaskRequestor[] = [
        {
          username: owner,
          confirm: true,
        },
      ];
      const now = new Date();
      const doc: Task = {
        vid: await this.taskUtils.generateVirtualId(type),
        reserve: time,
        requestor: requestorMapped,
        area: area._id,
        state: [staff ? TaskStateType.ACCEPT : TaskStateType.WAIT],
        type,
        forms,
        createAt: now,
        updateAt: now,
      };

      await this.taskModel.create(doc);
      await s.commitTransaction();
      s.endSession();
      return;
    } catch (err) {
      await s.abortTransaction();
      s.endSession();
      throw err;
    }
  }

  async getLastestTask(username: string): Promise<TaskLastCard | undefined> {
    try {
      const lastTask = await this.taskModel
        .find({
          requestor: {
            $elemMatch: {
              username,
            },
          },
        })
        .sort({ createAt: -1 })
        .limit(1)
        .select(['reserve', 'state', 'area', 'requestor', 'building'])
        .populate('area')
        .lean();
      if (!lastTask) return;

      const task = lastTask[0];
      if (!task) return undefined;
      return {
        ...task,
        owner: (task && task.requestor[0].username) || '',
        area: task.area,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskModel
      .findById(id)
      .select([
        'reserve',
        'state',
        'area',
        'requestor',
        'building',
        'forms',
        'type',
        'staff',
        'desc',
        'vid',
      ])
      .populate('area', '_id name label building')
      .lean();
    if (!task) return;

    const buildingId =
      (task.area && task.area.building._id) || task.building._id;
    const building = await this.areaBuildingModel
      .findById(buildingId)
      .select('_id name type label');

    // when only building
    if (!task.area) {
      task.area = {
        label: building.label,
      };
    }

    return {
      ...task,
      area: {
        ...task.area,
        building,
      },
    };
  }

  public AddDesc(task: TaskDoc, desc: string): TaskDesc[] {
    const now = new Date();
    const msg = desc.trim();
    const newMsg = msg.length > 0;

    if (!task.desc && newMsg) {
      return [
        {
          msg: desc,
          createAt: now,
        },
      ];
    }

    if (!newMsg) return task.desc;
    const descs = task.desc;
    return [
      ...descs,
      {
        msg: desc,
        createAt: now,
      },
    ];
  }

  async acceptTaskById(id: string, desc?: string): Promise<void> {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();
      const doc = await this.taskModel.findById(id).session(s);
      if (!doc) throw new BadRequestException('this task is not exisiting');

      doc.state.push(TaskStateType.ACCEPT);
      doc.updateAt = new Date();
      doc.desc = this.AddDesc(doc, desc);
      await doc.save({ session: s });
      await s.commitTransaction();
      s.endSession();

      return;
    } catch (err) {
      throw err;
    }
  }

  async cancleTaskById(
    id: string,
    username: string,
    staff: boolean = false,
    desc?: string,
  ): Promise<void> {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();
      const doc = await this.taskModel.findById(id).session(s);
      if (!doc) throw new BadRequestException('this task is not exisiting');
      const validCancel = doc.requestor[0].username === username;
      if (!validCancel) {
        if (!staff) {
          throw new BadRequestException('action is not permit');
        }
      }

      doc.state = [...doc.state, TaskStateType.DROP];
      doc.updateAt = new Date();
      doc.desc = this.AddDesc(doc, desc);
      await doc.save({ session: s });
      await s.commitTransaction();
      s.endSession();
      return;
    } catch (err) {
      await s.abortTransaction();
      s.endSession();
      throw new Error(err);
    }
  }

  async getQuickTask(
    areaId: string,
    start: moment.Moment,
    stop: moment.Moment,
  ): Promise<QuickTaskAPI[]> {
    const validaAreaId = await this.areaModel.findById(areaId).select('_id');
    if (!validaAreaId) throw new BadRequestException('bad area id');
    const tasks = await this.taskModel
      .find({
        area: mongoose.Types.ObjectId(areaId),
        state: {
          $nin: ['drop', 'reject'],
        },
        reserve: {
          $elemMatch: {
            start: {
              // FIX OFFSET DATE
              $gt: new Date(start.subtract(1, 'day').toISOString()),
              $lte: new Date(stop.add(1, 'day').toISOString()),
            },
          },
        },
      })
      .sort({ createAt: -1 })
      .select('_id vid requestor state reserve')
      .lean();

    return tasks.map(e => ({
      ...e,
      key: e._id,
      vid: e.vid,
      username: e.requestor[0].username,
      state: e.state.slice(-1)[0],
      date: e.reserve[0].start,
      requestor: undefined,
      reserve: undefined,
    }));
  }
}
