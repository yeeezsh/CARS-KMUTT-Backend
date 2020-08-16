import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskDoc, TaskStateType } from './interfaces/task.interface';

const DEFAULT_SELECT = '_id state cancle reserve requestor area createAt';
const DEAFAULT_POPULATE = 'area building';
const DEAFAULT_POPULATE_SELECT = '_id name label building';
const LIMIT_QUERY_FOR_USERS = 15;

function mapAreaBuilding(e) {
  return e.building ? { ...e, area: e.building } : e;
}

@Injectable()
export class TaskQueryService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc | any>,
  ) {}
  async getAllHistory(
    username: string,
    limit: number = LIMIT_QUERY_FOR_USERS,
  ): Promise<TaskDoc[]> {
    const doc = await this.taskModel
      .find({
        requestor: {
          $elemMatch: {
            username,
          },
        },
      })
      .sort({ createAt: -1 })
      .limit(limit)
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
      .lean();
    const parsed = doc.map(mapAreaBuilding);
    return parsed;
  }

  async getAllRequested(
    username: string,
    limit: number = LIMIT_QUERY_FOR_USERS,
  ): Promise<TaskDoc[]> {
    const doc = await this.taskModel
      .find({
        requestor: {
          $elemMatch: {
            username,
          },
        },
        state: {
          $in: [TaskStateType.REQUESTED],
          $nin: [TaskStateType.ACCEPT, TaskStateType.DROP],
        },
      })
      .sort({ createAt: -1 })
      .limit(limit)
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
      .lean();

    const parsed = doc.map(mapAreaBuilding);
    return parsed;
  }

  async getAllWait(
    username: string,
    limit: number = LIMIT_QUERY_FOR_USERS,
  ): Promise<TaskDoc[]> {
    const doc = await this.taskModel
      .find({
        requestor: {
          $elemMatch: {
            username,
          },
        },
        state: {
          $in: [
            TaskStateType.REQUESTED,
            TaskStateType.WAIT,
            TaskStateType.REJECT,
          ],
          $nin: [TaskStateType.ACCEPT, TaskStateType.DROP],
        },
      })
      .sort({ createAt: -1 })
      .limit(limit)
      .select(DEFAULT_SELECT)
      .populate(DEAFAULT_POPULATE, DEAFAULT_POPULATE_SELECT)
      .lean();

    const parsed = doc.map(mapAreaBuilding);
    return parsed;
  }
}
