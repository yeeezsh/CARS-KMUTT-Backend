import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ClientSession, Model } from 'mongoose';
import { AreaDoc } from 'src/area/interfaces/area.interface';
import { CreateSportTaskByStaffDto } from './dtos/task.create.bystaff.dto';
// import { AreaBuilding } from 'src/area/interfaces/area.building.interface';
// import { AreaQueryService } from 'src/area/area.query.service';
import { CreateTaskSportDto, TimeSlot } from './dtos/task.create.sport';
// interfaces & dto
import { Task, TaskDoc, TaskType } from './interfaces/task.interface';
import { TaskRequestor } from './interfaces/task.requestor.interface';

// import TaskSchedulePartitionArrHelper from './helpers/task.schedule.partition.arr.helper';
// import TaskScheduleStructArrHelper from './helpers/task.schedule.struct.arr.helper';

@Injectable()
export class TaskSportService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
    @Inject('AREA_MODEL') private readonly areaModel: Model<AreaDoc>,
  ) {}

  private async validReservation(
    areaId: mongoose.Types.ObjectId,
    time: TimeSlot[],
    sessions: ClientSession,
  ): Promise<boolean> {
    try {
      const SPORT_TYPE: TaskType = 'sport';
      const startTime = new Date(time[0].start);
      const stopTime = new Date(time[0].stop);
      const tasks = await this.taskModel
        .find({
          type: SPORT_TYPE,
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

  async createSportTaskByStaff(
    data: CreateSportTaskByStaffDto,
  ): Promise<TaskDoc> {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();
      const { area: areaId, time, owner, requestor } = data;

      const area = await this.areaModel
        .findById(areaId)
        .select(['reserve', 'required'])
        .session(s)
        .lean();
      if (!area) throw new BadRequestException('bad area id');

      // DANGER BYPASS
      // await this.checkAvailable(area, time, s);
      const now = new Date();
      const task = new this.taskModel({
        reserve: time,
        area: area._id,
        state: ['accept'],
        requestor: requestor.map(e => ({ username: e, comfirm: true })),
        type: 'sport',
        owner,
        createAt: now,
        updateAt: now,
      });

      await task.save({ session: s });
      await s.commitTransaction();
      s.endSession();

      return task;
    } catch (err) {
      await s.abortTransaction();
      s.endSession();
      throw err;
    }
  }

  async createSportTask(data: CreateTaskSportDto) {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();

      const { area: areaId, time, owner, requestor } = data;

      const area: AreaDoc = await this.areaModel
        .findById(areaId)
        .select(['reserve', 'required'])
        .session(s)
        .lean();

      if (!area) throw new BadRequestException('bad area id');
      await this.validReservation(area._id, data.time, s);

      // await this.checkAvailable(area, time, s);
      // console.log(requestor, owner);
      const ownerValid = requestor[0] === owner;
      if (!ownerValid) throw new Error('invalid owner');
      const requestorValidNumber =
        data.requestor.length === area.required.requestor;
      if (!requestorValidNumber) throw new Error('invalid n of requestor');

      const requestorMapped: TaskRequestor[] = requestor.map((e, i) => ({
        username: e,
        confirm: i === 0 ? true : false,
      }));

      const now = new Date();
      const doc: Task = {
        reserve: time,
        requestor: requestorMapped,
        area: area._id,
        state: requestor.length === 1 ? ['accept'] : ['requested'],
        type: 'sport',
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

  //   async getSportSchedule(
  //     id: string,
  //     date: Date = new Date(),
  //   ): Promise<TaskSchedule> {
  //     try {
  //       const area = await this.areaQueryService.getArea(id);

  //       //   validation area condition
  //       const nowDay = moment(date);
  //       const areaTimes = TaskSchedulePartitionArrHelper(area.reserve, nowDay);
  //       const schedule = TaskScheduleStructArrHelper(areaTimes);

  //       // query all reservation
  //       // const reserved = await this.taskModel
  //       //   .find({
  //       //     area: area._id,
  //       //   })
  //       //   .lean();
  //       // console.log('reserved area', reserved);
  //       // const reservedMapped = reserved.flatMap(e => e.time);
  //       // console.log('mapped', reservedMapped);

  //       const available: Array<{
  //         start: string;
  //         stop: string;
  //         n: number;
  //       }> = schedule.map(e => {
  //         return {
  //           ...e,
  //           n: 1,
  //         };
  //       });
  //       // console.log('areaTimes', areaTimes);
  //       // console.log('schedule', schedule);

  //       return {
  //         _id: area._id,
  //         schedule,
  //         available,
  //       };
  //     } catch (err) {
  //       throw err;
  //     }
  //   }

  async confirmTaskSportById(id: string, username: string): Promise<void> {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();
      const doc = await this.taskModel.findById(id).session(s);
      if (!doc) throw new Error('this task is not exisiting');
      const validConfirm = doc.requestor
        .flatMap(e => e.username)
        .includes(username);
      if (!validConfirm) throw new BadRequestException('action is not permit');
      const requestor = doc.requestor.map(e => {
        if (e.username === username) {
          return { username, confirm: true };
        }
        return e;
      });
      doc.requestor = requestor;
      const completeTask = requestor.every(e => e.confirm === true);

      if (completeTask) {
        doc.state.push('accept');
      }
      doc.updateAt = new Date();
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
}
