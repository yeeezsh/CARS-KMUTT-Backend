import * as mongoose from 'mongoose';
import { Model, ClientSession } from 'mongoose';
import * as moment from 'moment';
import {
  Injectable,
  Inject,
  //   forwardRef,
  BadRequestException,
} from '@nestjs/common';

// interfaces & dto
import { TaskDoc, Task } from './interfaces/task.interface';
import { AreaDoc } from 'src/area/interfaces/area.interface';
// import { AreaBuilding } from 'src/area/interfaces/area.building.interface';
// import { AreaQueryService } from 'src/area/area.query.service';
import { TimeSlot, CreateTaskSportDto } from './dtos/task.create.sport';
import { CreateSportTaskByStaffDto } from './dtos/task.create.bystaff.dto';
import { TaskRequestor } from './interfaces/task.requestor.interface';
// import { TaskSchedule } from './interfaces/task.schedule.interface';

// helper
import WeekParseHelper from './helpers/week.parse';
// import TaskSchedulePartitionArrHelper from './helpers/task.schedule.partition.arr.helper';
// import TaskScheduleStructArrHelper from './helpers/task.schedule.struct.arr.helper';

@Injectable()
export class TaskSportService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
    @Inject('AREA_MODEL') private readonly areaModel: Model<AreaDoc>,
  ) {}

  private async checkAvailable(
    area: AreaDoc,
    timeSlot: TimeSlot[],
    s: ClientSession,
  ): Promise<boolean> {
    const now = moment(timeSlot[0].start);
    const availableArea = area.reserve;
    availableArea.forEach(e => {
      // time validation
      const timeAreaStart = moment(e.start).set(
        'date',
        Number(now.format('DD')),
      );
      const timeAreaStop = moment(e.stop).set('date', Number(now.format('DD')));

      const timeAreaInterval = e.interval;
      // week validation
      const weeks = WeekParseHelper(e.week);
      timeSlot.forEach(ts => {
        // console.log(moment(ts.start).format('DD-MM-YYYY HH:mm'));
        // console.log(moment(ts.stop).format('DD-MM-YYYY HH:mm'));
        // const startTSWeek = Number(moment(ts.start).format('E'));
        // const stopTSWeek = Number(moment(ts.stop).format('E'));
        // console.log(startTSWeek, stopTSWeek, weeks);
        // if (!weeks.includes(startTSWeek) || !weeks.includes(stopTSWeek))
        //   throw new Error('invalid week');
        const startTSTime = moment(ts.start);
        const stopTSTime = moment(ts.stop);

        // DANGER NEED TIME VALIDATORS
        // DANGER NEED TIME VALIDATORS
        // DANGER NEED TIME VALIDATORS

        // if (
        //   moment(startTSTime.format('HH:MM')) >
        //   moment(timeAreaStop.format('HH:MM'))
        // )
        //   throw new Error('invalid start time');
        // if (stopTSTime.isBetween(timeAreaStart))
        //   throw new Error('invalid stop time');

        const intervalTSValid =
          stopTSTime.diff(startTSTime, 'minute') === timeAreaInterval;
        if (!intervalTSValid) throw new Error('invalid interval time');
        // DANGER NEED TO CREATE A TABLE INTERVAL FOR CHECKING VALID TIME
        // DANGER NEED TO CREATE A TABLE INTERVAL FOR CHECKING VALID TIME
        // DANGER NEED TO CREATE A TABLE INTERVAL FOR CHECKING VALID TIME
      });
    });

    const tasks: TaskDoc[] = await this.taskModel
      .find({ area: area.id })
      .select('reserve')
      .session(s)
      .lean();
    const timeTasks = tasks.map(e => e.reserve).flatMap(e => e);
    timeTasks.forEach(e => {
      const startTaskTime = moment(e.start);
      const stopTaskTime = moment(e.stop);
      timeSlot.forEach(ts => {
        const startTSTime = moment(ts.start);
        const stopTSTime = moment(ts.stop);
        if (startTSTime.format('HH:mm') === startTaskTime.format('HH:mm'))
          throw new Error('this slot have beeen reserve <start>');
        if (stopTSTime.format('HH:mm') === stopTaskTime.format('HH:mm'))
          throw new Error('this slot have beeen reserve <stop>');
      });
    });

    return true;
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

      await this.checkAvailable(area, time, s);
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
