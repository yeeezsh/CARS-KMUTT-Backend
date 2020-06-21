import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as moment from 'moment';

import { TaskDoc, TaskLastCard, Task } from './interfaces/task.interface';
import { TaskRequestor } from './interfaces/task.requestor.interface';
import { AreaDoc } from 'src/area/interfaces/area.interface';

import { AreaBuilding } from 'src/area/interfaces/area.building.interface';
// import { AreaQueryService } from 'src/area/area.query.service';
import { QuickTaskAPI } from './interfaces/task.quick.interface';

import { CreateTaskMeetingDto } from './dtos/task.meeting.dto';

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
  ) {}

  async createMeetingTask(
    data: CreateTaskMeetingDto,
    type: 'meeting-room' | 'meeting-club',
    owner: string,
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

      // await this.checkAvailable(area, time, s);
      // console.log(requestor, owner);

      const requestorMapped: TaskRequestor[] = [
        {
          username: owner,
          confirm: true,
        },
      ];

      const now = new Date();
      const doc: Task = {
        reserve: time,
        requestor: requestorMapped,
        area: area._id,
        state: ['wait'],
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

  async getTaskById(id: string): Promise<TaskDoc> {
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
      ])
      .populate('area', '_id name label building')
      .lean();

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

  async acceptTaskById(id: string, desc?: string): Promise<void> {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();
      const doc = await this.taskModel.findById(id).session(s);
      if (!doc) throw new BadRequestException('this task is not exisiting');

      doc.state.push('accept');
      doc.updateAt = new Date();
      // doc.desc = desc;
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

      doc.state.push('drop');
      doc.updateAt = new Date();
      // doc.desc = desc;
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

    console.log('qt st', start.format('DD-MM'));
    console.log('qt st', stop.format('DD-MM'));
    const tasks = await this.taskModel
      .find({
        area: mongoose.Types.ObjectId(areaId),
        state: {
          $nin: ['drop', 'reject'],
        },
        reserve: {
          $elemMatch: {
            start: {
              $gte: new Date(start.toISOString()),
              $lt: new Date(stop.toISOString()),
            },
          },
        },
      })
      .sort({ createAt: -1 })
      .select('_id requestor state reserve')
      .lean();

    return tasks.map(e => ({
      ...e,
      key: e._id,
      username: e.requestor[0].username,
      state: e.state.slice(-1)[0],
      date: e.reserve[0].start,
      requestor: undefined,
      reserve: undefined,
    }));
  }
}
