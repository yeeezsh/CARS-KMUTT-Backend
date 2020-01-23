import { Injectable, Inject } from '@nestjs/common';
import { Model, ClientSession } from 'mongoose';
import * as mongoose from 'mongoose';
import * as moment from 'moment';

import { Task, Requestor } from './interfaces/task.interface';
import { Area } from 'src/area/interfaces/area.interface';
import { TaskSchedule } from './interfaces/task.schedule.interface';

import { CreateTaskSportDto, TimeSlot } from './dtos/task.create.sport';
import TaskSchedulePartitionArrHelper from './helpers/task.schedule.partition.arr.helper';
import TaskScheduleStructArrHelper from './helpers/task.schedule.struct.arr.helper';
import { AreaService } from '../area/area.service';

import WeekParseHelper from './helpers/week.parse';

// constant
const FORMAT = 'DD-MM-YYYY-HH:mm:ss';
const TIME_FORMAT = 'HH:mm:ss';
const DAY_FORMAT = 'DD-MM-YYYY';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
    @Inject('AREA_MODEL') private readonly areaModel: Model<Area>,
    private readonly areaService: AreaService,
  ) {}

  private async checkAvailable(
    area: Area,
    timeSlot: TimeSlot[],
    s: ClientSession,
  ): Promise<boolean> {
    const now = moment();
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
        const startTSWeek = Number(moment(ts.start).format('E'));
        const stopTSWeek = Number(moment(ts.stop).format('E'));
        // console.log(startTSWeek, stopTSWeek, weeks);
        if (!weeks.includes(startTSWeek) || !weeks.includes(stopTSWeek))
          throw new Error('invalid week');
        const startTSTime = moment(ts.start);
        const stopTSTime = moment(ts.stop);

        if (startTSTime.isAfter(timeAreaStop))
          throw new Error('invalid start time');
        if (stopTSTime.isBetween(timeAreaStart))
          throw new Error('invalid stop time');
        console.log(stopTSTime.diff(startTSTime, 'minute'));
        const intervalTSValid =
          stopTSTime.diff(startTSTime, 'minute') === timeAreaInterval;
        if (!intervalTSValid) throw new Error('invalid interval time');
        // DANGER NEED TO CREATE A TABLE INTERVAL FOR CHECKING VALID TIME
        // DANGER NEED TO CREATE A TABLE INTERVAL FOR CHECKING VALID TIME
        // DANGER NEED TO CREATE A TABLE INTERVAL FOR CHECKING VALID TIME
      });
    });

    const tasks: Task[] = await this.taskModel
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
        if (stopTSTime.format('HH:mm') === startTaskTime.format('HH:mm'))
          throw new Error('this slot have beeen reserve <stop>');
      });
    });

    return true;
  }

  async createSportTask(data: CreateTaskSportDto) {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();

      const { area: areaId, time, owner, requestor } = data;
      const area: Area = await this.areaModel
        .findById(areaId)
        .select(['reserve', 'required'])
        .session(s)
        .lean();

      await this.checkAvailable(area, time, s);
      console.log(requestor, owner);
      const ownerValid = requestor[0] === owner;
      if (!ownerValid) throw new Error('invalid owner');
      const requestorValidNumber =
        data.requestor.length === area.required.requestor;
      if (!requestorValidNumber) throw new Error('invalid n of requestor');

      const requestorMapped: Requestor[] = requestor.map(e => ({
        username: e,
        confirm: false,
      }));

      const doc: Task | any = {
        reserve: time,
        requestor: requestorMapped,
        area: area.id,
        state: requestor.length === 0 ? ['accept'] : ['wait'],
        cancle: false,
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

  async getSportSchedule(
    id: string,
    date: Date = new Date(),
  ): Promise<TaskSchedule> {
    try {
      const area = await this.areaService.getArea(id);

      //   validation area condition
      const nowDay = moment(date);
      const areaTimes = TaskSchedulePartitionArrHelper(area.reserve, nowDay);
      const schedule = TaskScheduleStructArrHelper(areaTimes);

      // query all reservation
      const reserved = await this.taskModel
        .find({
          area: area._id,
        })
        .lean();
      console.log('reserved area', reserved);
      const reservedMapped = reserved.flatMap(e => e.time);
      console.log('mapped', reservedMapped);

      const available: Array<{
        start: string;
        stop: string;
        n: number;
      }> = schedule.map(e => {
        return {
          ...e,
          n: 1,
        };
      });
      console.log('areaTimes', areaTimes);
      console.log('schedule', schedule);

      return {
        _id: area._id,
        schedule,
        available,
      };
    } catch (err) {
      throw err;
    }
  }
}
