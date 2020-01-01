import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';

import { TaskCreateSportDto } from './dtos/task.create.sport';
import * as moment from 'moment';
import { TaskSchedule } from './interfaces/task.schedule.interface';
import { AreaService } from 'src/area/area.service';

// constant
const FORMAT = 'DD-MM-YYYY-HH:mm:ss';
const TIME_FORMAT = 'HH:mm:ss';
const DAY_FORMAT = 'DD-MM-YYYY';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
    private readonly areaService: AreaService,
  ) { }

  async createTaskSport(data: TaskCreateSportDto) {
    console.log('task service', data);
    // await this.taskQueryService.getTimesByAreaId(data.area);
    return {};
  }

  async getSportSchedule(id: string, date: Date = new Date()): Promise<TaskSchedule> {
    try {
      const area = await this.areaService.getArea(id);

      //   validation area condition
      const nowDay = moment(date);
      const areaTimes: Array<{
        start: string;
        stop: string;
      }> = area.reserve.flatMap(e => {
        const start = moment(e.start, 'HH:mm:ss');
        const stop = moment(e.stop, 'HH:mm:ss');
        let partition = start;
        const arr = [];
        arr.push(partition.format(FORMAT));
        while (partition < stop) {
          partition = partition.add(e.interval, 'minutes');
          arr.push(
            `${nowDay.format(DAY_FORMAT)}-${partition.format(TIME_FORMAT)}`,
          );
        }
        return arr;
      });
      const schedule: Array<{ start: string; stop: string }> = areaTimes
        .map((e, i, arr) => {
          console.log(i, arr.length - 1);
          if (i === arr.length - 1) {
            return null;
          }
          return {
            start: String(e),
            stop: String(arr[i + 1]),
          };
        })
        .filter(e => Boolean(e));

      // query all reservation

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
      // return areaTimes;

      return {
        _id: area._id,
        // schedule: [],
        schedule,
        available,
      };
    } catch (err) {
      throw err;
    }
  }
}
