import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskDoc } from './interfaces/task.interface';

const DEFAULT_SELECT = '_id state cancle reserve requestor area createAt';
const DEAFAULT_POPULATE = 'area building';
const DEAFAULT_POPULATE_SELECT = '_id name label building';

function mapAreaBuilding(e) {
  return e.building ? { ...e, area: e.building } : e;
}

@Injectable()
export class TaskQueryService {
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
      .sort({ createAt: -1 })
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
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
      .sort({ createAt: -1 })
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
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
      .sort({ createAt: -1 })
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
      .lean();

    const parsed = doc.map(mapAreaBuilding);
    return parsed;
  }
}
