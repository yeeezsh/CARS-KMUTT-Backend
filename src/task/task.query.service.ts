import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import { AreaService } from 'src/area/area.service';

@Injectable()
export class TaskQueryService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
    private readonly areaService: AreaService,
  ) {}

  async valid(areaID: string, time: Date[]) {
    try {
      const area = await this.areaService.getArea(areaID);
      const timeTable = area.reserve.forEach(
        ({ start, stop, interval, max }) => {},
      );
    } catch (err) {
      throw err;
    }
  }
}
