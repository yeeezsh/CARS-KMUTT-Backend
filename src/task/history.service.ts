import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { Task } from './interfaces/task.interface';

const DEFAULT_SELECT = '_id state cancle reserve requestor area createAt';
const DEAFAULT_POPULATE = 'area';
const DEAFAULT_POPULATE_SELECT = '_id name label building';

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
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
      .sort({ createAt: -1 });
  }

  async getAllRequested(username: string): Promise<Task[]> {
    return await this.taskModel
      .find({
        requestor: {
          $elemMatch: {
            username,
          },
        },
        state: {
          $in: ['requested'],
          $nin: ['accept'],
        },
      })
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
      .sort({ createAt: -1 });
  }

  async getAllWait(username: string): Promise<Task[]> {
    return await this.taskModel
      .find({
        requestor: {
          $elemMatch: {
            username,
          },
        },
        state: {
          $in: ['requested', 'wait'],
          $nin: ['accept', 'drop'],
        },
      })
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
      .sort({ createAt: -1 });
  }
}
