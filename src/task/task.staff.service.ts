import { Injectable, Inject } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { TaskDoc } from './interfaces/task.interface';
import { TaskManage } from './interfaces/task.manage.interface';
import { STAFF_PERMISSION } from 'src/users/schemas/staffs.schema';
import { TaskStaffRequested } from './interfaces/task.staff.requested.interface';
import staffGroupLvHelper from './helpers/staff.group.lv.helper';

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
        // $nin: ['accept'],
        $in: ['drop'],
      },
    });
  }

  async forwardTask(id: string): Promise<void> {
    const s = await mongoose.startSession();
    try {
      s.startTransaction();
      const task = await this.taskModel
        .findById(id)
        .session(s)
        .select(['_id', 'staff']);
      const START_STAFF_LV_IND = 0;
      const STAFF_LEVEL = STAFF_PERMISSION;
      const alreadyPermit = task.staff && task.staff.length > 1;
      let staff: TaskStaffRequested[] = [];
      if (alreadyPermit) {
        let nextLevelStaff: number =
          staffGroupLvHelper(task.staff.slice(-1)[0]) + 1;
        // preveting from out of index
        if (nextLevelStaff > STAFF_LEVEL.length) {
          nextLevelStaff = STAFF_LEVEL.length;
        }

        staff = [
          ...task.staff,
          { group: STAFF_LEVEL[nextLevelStaff], approve: false },
        ];
      } else {
        staff = [{ group: STAFF_LEVEL[START_STAFF_LV_IND], approve: false }];
      }

      task.staff = staff;
      await task.save({ session: s });
      await s.commitTransaction();
      s.endSession();
      return;
    } catch (err) {
      await s.abortTransaction();
      throw err;
    }
  }
}
