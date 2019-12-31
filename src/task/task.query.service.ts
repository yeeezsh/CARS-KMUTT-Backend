import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import { AreaService } from 'src/area/area.service';
import * as moment from 'moment';

interface TimeSchema {
  start: Date;
  stop: Date;
}

const FORMAT = 'hh:mm:ss';

@Injectable()
export class TaskQueryService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
    private readonly areaService: AreaService,
  ) { }

  // async valid(areaID: string, time: TimeSchema[]) {
  async valid(areaID: string, times: TimeSchema[]) {
    try {
      const area = await this.areaService.getArea(areaID);
      //   validation area condition
      const areaTimes: Date[] = area.reserve.flatMap(e => {
        const start = moment(e.start);
        const stop = moment(e.stop);
        let partition = start;
        const arr = [];
        while (partition <= stop) {
          arr.push(partition.format(FORMAT));
          partition = partition.add(e.interval, 'minutes');
        }
        return arr;
      });

      const valid = areaTimes
        .map((e, ind, arr) => {
          if (ind === 0) {
            return null;
          }
          return { start: arr[ind - 1], stop: e };
        })
        .filter(e => e);
      const foundRange = valid
        .map(({ start: areaStart, stop: areaStop }) => {
          return times.forEach(({ start, stop }) => {
            if (
              moment(start).format(FORMAT) ===
              moment(areaStart).format(FORMAT) &&
              moment(stop).format(FORMAT) === moment(areaStop).format(FORMAT)
            ) {
              return {
                start: moment(start).format(FORMAT),
                stop: moment(stop).format(FORMAT),
              };
            }
            return false;
          });
        })
        .filter(e => Boolean(e));
      if (foundRange.length === 0) {
        throw Error('reservation time not valid for this area');
      }
      console.log(foundRange);
      return area;
      // .filter(e => Boolean(e));

      // time.forEach(({ start: taskStart, stop: taskStop }) => {
      //     area.reserve.forEach(
      //         ({ start, stop, interval, max }) => {

      //         },
      //     );
      // })
      //   const reservedTask = await this.taskModel.find({

      //   })
    } catch (err) {
      throw err;
    }
  }
}
