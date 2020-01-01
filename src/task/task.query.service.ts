import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import { AreaService } from 'src/area/area.service';
import * as moment from 'moment';

interface TimeSchema {
  start: Date;
  stop: Date;
}

const FORMAT = 'DD-MM-YYYY-HH:mm:ss';
const TIME_FORMAT = 'HH:mm:ss';
const DAY_FORMAT = 'DD-MM-YYYY';

@Injectable()
export class TaskQueryService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
    private readonly areaService: AreaService,
  ) { }

  // async valid(areaID: string, time: TimeSchema[]) {
  async getTimesByAreaId(
    areaID: string,
  ): Promise<Array<{ start: string; stop: string }>> {
    try {
      const area = await this.areaService.getArea(areaID);
      console.log('area', area);
      //   validation area condition
      const nowDay = moment();
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
      console.log('areaTimes', areaTimes);
      return areaTimes;
    } catch (err) {
      throw err;
    }
  }
}
