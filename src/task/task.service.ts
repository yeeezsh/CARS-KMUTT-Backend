import { Injectable, Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';

import { Task } from './interfaces/task.interface';
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
    private readonly areaService: AreaService,
  ) {}

  private async checkAvailable(
    areaId: string,
    timeSlot: TimeSlot[],
  ): Promise<boolean> {
    const today = moment(new Date());
    // area validation
    const area: Area = await this.areaService.getArea(areaId);
    if (!area) throw new Error('invalid area id');
    const availableArea = area.reserve;
    availableArea.forEach(e => {
      // time validation
      const timeAreaStart = moment(e.start);
      const timeAreaStop = moment(e.stop);
      const timeAreaInterval = e.interval;
      // week validation
      const weeks = WeekParseHelper(e.week);
      timeSlot.forEach(ts => {
        const startTSWeek = Number(moment(ts.start).format('E'));
        const stopTSWeek = Number(moment(ts.stop).format('E'));
        if (!weeks.includes(startTSWeek) || !weeks.includes(stopTSWeek))
          throw new Error('invalid week');
        const startTSTime = moment(ts.start);
        const stopTSTime = moment(ts.stop);
        if (!startTSTime.isBetween(timeAreaStart, timeAreaStop, null, '[]'))
          throw new Error('invalid start time');
        if (!stopTSTime.isBetween(timeAreaStart, timeAreaStop, null, '[]'))
          throw new Error('invalid stop time');
        const intervalTSValid =
          startTSTime.diff(stopTSTime, 'minute') === timeAreaInterval;
        if (!intervalTSValid) throw new Error('invalid interval time');
        // DANGER NEED TO CREATE A TABLE INTERVAL FOR CHECKING VALID TIME
        // DANGER NEED TO CREATE A TABLE INTERVAL FOR CHECKING VALID TIME
        // DANGER NEED TO CREATE A TABLE INTERVAL FOR CHECKING VALID TIME
      });
    });

    const tasks: Task[] = await this.taskModel.find({ area: area.id });
    const timeTasks = tasks.map(e => e.reserve).flatMap(e => e);
    timeTasks.forEach(e => {
      const startTaskTime = moment(e.start);
      const stopTaskTime = moment(e.stop);
      timeSlot.forEach(ts => {
        const startTSTime = moment(ts.start);
        const stopTSTime = moment(ts.stop);
        if (startTSTime.isBetween(startTaskTime, stopTaskTime, null, '[]'))
          throw new Error('this slot have beeen reserve <start>');
        if (stopTSTime.isBetween(startTaskTime, stopTaskTime, null, '[]'))
          throw new Error('this slot have beeen reserve <stop>');
      });
    });

    return true;
  }

  async createSportTask(data: CreateTaskSportDto) {
    try {
      console.log('task service', data);
      const { area, time } = data;
      await this.checkAvailable(area, time);
      // await this.taskQueryService.getTimesByAreaId(data.area);
      return {};
    } catch (err) {
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
