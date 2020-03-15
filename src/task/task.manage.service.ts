import { Injectable, Inject } from '@nestjs/common';

import { Model } from 'mongoose';

import { Task } from './interfaces/task.interface';
import moment = require('moment');
import { TaskManage } from './interfaces/task.manage.interface';

@Injectable()
export class TaskManageService {
  constructor(@Inject('TASK_MODEL') private readonly taskModel: Model<Task>) {}

  async getAllTask(
    offset?: Date,
    limit?: Date,
    // tslint:disable-next-line: ban-types
    query: Object = {},
  ): Promise<TaskManage[]> {
    if (!offset || !limit) {
      const now = moment().startOf('day');
      offset = now.toDate();
      limit = moment(now)
        .add('1', 'day')
        .toDate();
    }

    const docs: TaskManage[] = await this.taskModel.aggregate([
      {
        $match: {
          // back verse query
          // createAt: {
          //   $lte: moment(offset).toDate(),
          //   $gte: moment(limit).toDate(),
          // },
          ...query,
        },
      },
      {
        $lookup: {
          from: 'areas',
          localField: 'area',
          foreignField: '_id',
          as: 'area',
        },
      },
      { $unwind: '$area' },
      {
        $lookup: {
          from: 'area.buildings',
          localField: 'area.building',
          foreignField: '_id',
          as: 'type',
        },
      },
      { $unwind: '$type' },
      {
        $project: {
          _id: 1,
          requestor: 1,
          'area.label': 1,
          'area.name': 1,
          type: '$type.type',
          createAt: 1,
          state: 1,
        },
      },
      { $sort: { createAt: -1 } },
    ]);

    return docs;
  }

  async getWaitTask(offset?: Date, limit?: Date) {
    return await this.getAllTask(offset, limit, {
      state: {
        $in: ['wait', 'requested'],
        $nin: ['drop', 'reject', 'accept'],
      },
    });
  }

  async getAcceptTask(offset?: Date, limit?: Date) {
    return await this.getAllTask(offset, limit, {
      state: {
        $in: ['accept'],
        $nin: ['reject', 'drop'],
      },
    });
  }

  async getRejectTask(offset?: Date, limit?: Date) {
    return await this.getAllTask(offset, limit, {
      state: {
        $in: ['reject'],
      },
    });
  }

  async getDropTask(offset?: Date, limit?: Date) {
    return await this.getAllTask(offset, limit, {
      state: {
        $nin: ['accept'],
        $in: ['drop'],
      },
    });
  }
}
