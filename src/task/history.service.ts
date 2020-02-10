import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Task } from './interfaces/task.interface';

@Injectable()
export class HistoryService {
  constructor(@Inject('TASK_MODEL') private readonly taskModel: Model<Task>) {}

  async getAllHistory(username: string): Promise<Task[]> {
    return await this.taskModel
      .find({
        requestor: {
          $elemMatch: {
            username,
          },
        },
      })
      .select('state cancle reserve requestor area createAt')
      .populate('area', '_id name label building')
      .sort({ createAt: -1 });
  }
}
