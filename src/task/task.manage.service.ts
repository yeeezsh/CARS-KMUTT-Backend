import { Injectable, Inject } from '@nestjs/common';

import { Model } from 'mongoose';

import { Task } from './interfaces/task.interface';
import moment = require('moment');
import { TaskManage } from './interfaces/task.manage.interface';

@Injectable()
export class TaskManageService {
  constructor(@Inject('TASK_MODEL') private readonly taskModel: Model<Task>) {}

  async getAcceptTask(offset?: Date, limit?: Date): Promise<TaskManage[]> {
    if (!offset || !limit) {
      const now = moment().startOf('day');
      offset = now.toDate();
      limit = now.add('1', 'day').toDate();
    }

    const docs: TaskManage[] = await this.taskModel.aggregate([
      {
        $match: {
          createAt: {
            $gte: offset,
            $lte: limit,
          },
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
        },
      },
    ]);

    return docs;
  }
}
