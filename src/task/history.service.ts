import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { TaskDoc } from './interfaces/task.interface';

const DEFAULT_SELECT = '_id state cancle reserve requestor area createAt';
const DEAFAULT_POPULATE = 'area building';
const DEAFAULT_POPULATE_SELECT = '_id name label building';

function mapAreaBuilding(e) {
  return e.building ? { ...e, area: e.building } : e;
}

@Injectable()
export class HistoryService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc | any>,
  ) {}
  async getAllHistory(username: string): Promise<TaskDoc[]> {
    const doc = await this.taskModel
      .find({
        requestor: {
          $elemMatch: {
            username,
          },
        },
      })
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
      .sort({ createAt: -1 })
      .lean();
    const parsed = doc.map(mapAreaBuilding);
    return parsed;
  }

  async getAllRequested(username: string): Promise<TaskDoc[]> {
    const doc = await this.taskModel
      .find({
        requestor: {
          $elemMatch: {
            username,
          },
        },
        state: {
          $in: ['requested'],
          $nin: ['accept', 'drop'],
        },
      })
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
      .sort({ createAt: -1 })
      .lean();

    const parsed = doc.map(mapAreaBuilding);
    return parsed;
  }

  async getAllWait(username: string): Promise<TaskDoc[]> {
    const doc = await this.taskModel
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
      .sort({ createAt: -1 })
      .lean();

    const parsed = doc.map(mapAreaBuilding);
    return parsed;
  }
}
