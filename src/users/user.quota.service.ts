import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  TaskDoc,
  TaskStateType,
  TaskType,
} from 'src/task/interfaces/task.interface';
import { Requestor } from './interfaces/requestor.interface';
import { UserSession } from './interfaces/user.session.interface';

const MAX_SPORT_REQUESTOR_QUOTA = 1;

@Injectable()
export class UserQuotaService {
  constructor(
    @Inject('REQUESTOR_MODEL')
    private readonly requestorModel: Model<Requestor>,
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
  ) {}

  async getSportQuota(user: UserSession) {
    const username = user.username;
    const reserve = await this.taskModel
      .find({
        state: {
          $nin: [TaskStateType.DROP, TaskStateType.REJECT],
        },
        type: TaskType.sport,
        requestor: {
          $elemMatch: {
            username,
          },
        },
        reserve: {
          $elemMatch: {
            start: {
              $gte: new Date(),
            },
          },
        },
      })
      .countDocuments();

    return {
      n: MAX_SPORT_REQUESTOR_QUOTA - reserve,
    };
  }
}
