import { Injectable, Inject } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { TaskDoc } from './interfaces/task.interface';

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
          state: {
            $in: ['requested'],
            $nin: ['accept', 'drop'],
          },
        })
        .session(s)
        .select('_id createAt')
        .lean();
      const dropList: string[] = waitTask
        .filter(e => moment(now).diff(e.createAt, 'minute') > EXPIRE_TIME)
        .map(e => e._id);

      const updated = await this.taskModel
        .updateMany(
          {
            _id: { $in: dropList },
          },
          {
            state: ['requested', 'drop'],
            updateAt: now,
          },
        )
        .session(s);
      console.log('drop timout : ', updated.n, 'task');
      await s.commitTransaction();
      s.endSession();
    } catch (err) {
      await s.abortTransaction();
      throw err;
    }
  }
}
