import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Task } from './interfaces/task.interface';
import { TaskQueryService } from './task.query.service';
import { TaskCreateSportDto } from './dtos/task.create.sport';
import * as moment from 'moment';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
    private readonly taskQueryService: TaskQueryService,
  ) { }

  async createTaskSport(data: TaskCreateSportDto) {
    console.log('task service', data);
    await this.taskQueryService.getTimesByAreaId(data.area);
    return {};
  }

  async getSportSchedule() { }
}
