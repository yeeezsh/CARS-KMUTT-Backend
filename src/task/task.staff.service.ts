import { Injectable, Inject } from '@nestjs/common';

import { Model } from 'mongoose';

import { TaskDoc } from './interfaces/task.interface';
import moment = require('moment');
import { TaskManage } from './interfaces/task.manage.interface';

@Injectable()
export class TaskstaffService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
  ) {}

  async getAllTask(
    offset?: number,
    limit?: number,
    // tslint:disable-next-line: ban-types
    query: Object = {},
  ): Promise<TaskManage[]> {
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
      // {
      //   $lookup: {
      //     from: 'area.buildings',
      //     localField: 'area',
      //     foreignField: '_id',
      //     as: 'area',
      //   },
      // },
      {
        $lookup: {
          from: 'areas',
          localField: 'area',
          foreignField: '_id',
          as: 'area',
        },
      },

      { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
      // {
      //   $lookup: {
      //     from: 'area.buildings',
      //     localField: 'area.building',
      //     foreignField: '_id',
      //     as: 'type',
      //   },
      // },
      // { $unwind: '$type' },
      {
        $project: {
          _id: 1,
          key: '$_id',
          requestor: 1,
          'area.label': 1,
          'area.name': 1,
          type: 1,
          createAt: 1,
          state: 1,
        },
      },
      { $sort: { createAt: -1 } },
    ]);
    return docs;
  }

  async getWaitTask(offset?: number, limit?: number) {
    return await this.getAllTask(offset, limit, {
      state: {
        $in: ['wait', 'requested'],
        $nin: ['drop', 'reject', 'accept'],
      },
    });
  }

  async getAcceptTask(offset?: number, limit?: number) {
    return await this.getAllTask(offset, limit, {
      state: {
        $in: ['accept'],
        $nin: ['reject', 'drop'],
      },
    });
  }

  async getRejectTask(offset?: number, limit?: number) {
    return await this.getAllTask(offset, limit, {
      state: {
        $in: ['reject'],
      },
    });
  }

  async getDropTask(offset?: number, limit?: number) {
    return await this.getAllTask(offset, limit, {
      state: {
        $nin: ['accept'],
        $in: ['drop'],
      },
    });
  }
}
