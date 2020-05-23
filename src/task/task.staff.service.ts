import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskDoc } from './interfaces/task.interface';
import { TaskManage } from './interfaces/task.manage.interface';

const LIMIT = 10;

@Injectable()
export class TaskstaffService {
  constructor(
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
  ) {}

  async getAllTask(
    offset?: number,
    limit?: number,
    orderCol?: string,
    order?: number,

    // tslint:disable-next-line: ban-types
    query: Object = {},
  ): Promise<{ data: TaskManage[]; count: number }> {
    const orderColField: string = orderCol || 'createAt';
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
      { $sort: { [orderColField]: order || -1 } },
      { $skip: offset || 0 },
      { $limit: limit || LIMIT },
      {
        $lookup: {
          from: 'areas',
          localField: 'area',
          foreignField: '_id',
          as: 'area',
        },
      },

      { $unwind: { path: '$area', preserveNullAndEmptyArrays: true } },
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
    ]);
    const count = await this.taskModel.find({ ...query }).countDocuments();
    return { data: docs, count };
  }

  async getWaitTask(
    offset?: number,
    limit?: number,
    orderCol?: string,
    order?: number,
  ) {
    return await this.getAllTask(offset, limit, orderCol, order, {
      state: {
        $in: ['wait', 'requested'],
        $nin: ['drop', 'reject', 'accept'],
      },
    });
  }

  async getAcceptTask(
    offset?: number,
    limit?: number,
    orderCol?: string,
    order?: number,
  ) {
    return await this.getAllTask(offset, limit, orderCol, order, {
      state: {
        $in: ['accept'],
        $nin: ['reject', 'drop'],
      },
    });
  }

  async getRejectTask(
    offset?: number,
    limit?: number,
    orderCol?: string,
    order?: number,
  ) {
    return await this.getAllTask(offset, limit, orderCol, order, {
      state: {
        $in: ['reject'],
      },
    });
  }

  async getDropTask(
    offset?: number,
    limit?: number,
    orderCol?: string,
    order?: number,
  ) {
    return await this.getAllTask(offset, limit, orderCol, order, {
      state: {
        $nin: ['accept'],
        $in: ['drop'],
      },
    });
  }
}
