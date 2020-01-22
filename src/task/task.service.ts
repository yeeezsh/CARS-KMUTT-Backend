import { Injectable, Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Task } from './interfaces/task.interface';

import { TaskCreateSportDto } from './dtos/task.create.sport';
import * as moment from 'moment';
import { TaskSchedule } from './interfaces/task.schedule.interface';
import TaskSchedulePartitionArrHelper from './helpers/task.schedule.partition.arr.helper';
import TaskScheduleStructArrHelper from './helpers/task.schedule.struct.arr.helper';
import { AreaService } from '../area/area.service';

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

  async createTaskSport(data: TaskCreateSportDto) {
    console.log('task service', data);
    // await this.taskQueryService.getTimesByAreaId(data.area);
    return {};
  }

  async getSportSchedule(
    id: Types.ObjectId,
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
