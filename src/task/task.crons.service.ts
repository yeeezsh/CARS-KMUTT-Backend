import { Inject, Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { TaskDoc, TaskStateType, TaskType } from './interfaces/task.interface';

@Injectable()
export class TaskCronsService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
  ) {}

  // delete timeout task every 60s
  @Interval(60000)
  async handleRequestedTask() {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();
      const EXPIRE_TIME = 60; // minutes units
      const now = new Date();
      const waitTask = await this.taskModel
        .find({
          type: TaskType.sport,
          state: {
            $in: [TaskStateType.REQUESTED],
            $nin: [TaskStateType.ACCEPT, TaskStateType.DROP],
          },
        })
        .session(s)
        .select('_id createAt')
        .lean();

      const dropList: string[] = waitTask
        .filter(e => moment(now).diff(e.createAt, 'minute') > EXPIRE_TIME)
        .map(e => e._id);

      // update
      await this.taskModel
        .updateMany(
          {
            _id: { $in: dropList },
          },
          {
            state: [TaskStateType.REQUESTED, TaskStateType.DROP],
            updateAt: now,
          },
        )
        .session(s);

      await s.commitTransaction();
      s.endSession();
    } catch (err) {
      await s.abortTransaction();
      throw err;
    }
  }
}
