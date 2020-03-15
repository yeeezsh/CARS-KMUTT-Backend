import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Area } from './interfaces/area.interface';
import { AreaBuilding } from './interfaces/area.building.interface';

import { Moment } from 'moment';
import { AreaAvailble } from './interfaces/area.available.interface';
import { Task } from 'src/task/interfaces/task.interface';
import moment = require('moment');
import { AreaTableAPI } from './interfaces/area.table.interface';
import { AreaAvailableStaff } from './interfaces/area.available.staff.interface';
import weekParse from 'src/task/helpers/week.parse';
import { TimeNode } from './interfaces/timenode.interface';

@Injectable()
export class AreaQueryService {
  constructor(
    @Inject('AREA_MODEL') private readonly areaModel: Model<Area>,
    @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
    @Inject('AREA_BUILDING_MODEL')
    private readonly areaBuildingModel: Model<AreaBuilding>,
  ) {}

  private async getReservedAreaTimeInOneDay(
    areaId: string,
    date?: Moment,
  ): Promise<TimeNode[]> {
    if (!date) return;
    return await this.taskModel.aggregate([
      {
        $match: {
          area: Types.ObjectId(areaId),
          // createAt: {
          //   $gte: new Date(date.toISOString()),
          //   $lte: new Date(moment(date.add(1, 'day')).toISOString()),
          // },
          reserve: {
            $elemMatch: {
              start: {
                $gte: new Date(date.toISOString()),
                $lte: new Date(moment(date.add(1, 'day')).toISOString()),
              },
            },
          },
          state: {
            $in: ['wait', 'requested', 'accept'],
            $nin: ['drop', 'reject'],
          },
        },
      },
      { $group: { _id: '$area', values: { $push: '$$ROOT.reserve' } } },

      { $unwind: '$values' },
      { $unwind: '$values' },
      { $project: { value: '$values.start', _id: 0, type: 'disabled' } },
    ]);
  }

  async getAvailabelAreaByStaff(areaId: string): Promise<AreaAvailableStaff[]> {
    try {
      const area = await this.areaModel
        .findById(areaId)
        .populate('building', 'label name')
        .select('name label building forward reserve');

      if (!area) throw new BadRequestException('bad area id');

      const today = moment().startOf('day');
      const forward = area.forward;
      const weeks = weekParse(area.reserve[0].week);
      const validDay = Array(forward)
        .fill([])
        .map((e, i) => {
          const day = moment(today).add(1, 'day');
          if (weeks.includes(Number(day.format('E')))) {
            return {
              date: moment(day).add(i, 'day'),
            };
          }
          return 0;
        })
        .filter(e => e !== 0);

      const availableDays = await Promise.all(
        validDay.map(e =>
          this.getReservedAreaTimeInOneDay(area._id, e && e.date),
        ),
      );

      const mapped = validDay.map((e, i) => ({
        ...e,
        _id: area._id,
        name: area.name,
        label: area.label,
        building: {
          _id: area.building._id,
          name: area.building.name,
          label: area.building.label,
        },
        disabled: availableDays[i],
        date: e && new Date(e.date.toISOString()),
      }));

      return mapped;
    } catch (err) {
      throw err;
    }
  }

  async getAreaTable(): Promise<AreaTableAPI[]> {
    try {
      const areas = await this.areaModel
        .find({})
        .populate('building', 'name label')
        .select({
          reserve: 0,
          required: 0,
          forward: 0,
          createAt: 0,
          updateAt: 0,
        })
        .lean();

      return areas.map(e => ({ ...e, key: e._id }));
    } catch (err) {
      throw err;
    }
  }

  async listAreaType(type?: string): Promise<AreaBuilding[]> {
    try {
      let query = {};
      if (type) query = { type };
      const doc = await this.areaBuildingModel.find(query).lean();
      return doc;
    } catch (err) {
      throw err;
    }
  }

  async listArea(): Promise<Area[]> {
    try {
      const doc = await this.areaModel
        .find({})
        .populate(['building', 'required.form', 'required.staff'])
        .lean();
      return doc;
    } catch (err) {
      throw err;
    }
  }

  async getArea(id: string): Promise<Area> {
    try {
      const doc = await this.areaModel
        .findById(id)
        .populate(['building'])
        .lean();
      if (!doc) {
        throw Error('_id is not exisiting');
      }
      return doc;
    } catch (err) {
      throw err;
    }
  }

  async getAreaBuilding(id?: string): Promise<AreaBuilding[]> {
    try {
      let query = {};
      if (id) query = { _id: id };
      const doc = await this.areaBuildingModel.find(query).lean();
      if (!doc) {
        throw Error('_id is not exisiting');
      }
      return doc;
    } catch (err) {
      throw err;
    }
  }

  async getSportAreaFields(id: string): Promise<Area[]> {
    return await this.areaModel.find({ building: id }).lean();
  }

  async getAvailableSportAreaFields(
    id: string,
    date: Moment,
  ): Promise<AreaAvailble[]> {
    // ): Promise<any[]> {
    // ): Promise<any> {
    const fields: Area[] = await this.areaModel.find({ building: id }).lean();
    const maxForward = fields.reduce((prev, cur) =>
      prev.forward > cur.forward ? prev : cur,
    ).forward;
    const startDay = moment(moment(date).startOf('day'));
    const stopDay = moment(startDay).add(1, 'day');
    // console.log('maxforward', maxForward);
    // console.log(startDay.format('DD-MM-YYYY'));
    // console.log(stopDay.format('DD-MM-YYYY'));

    const taskQuery = fields.map(e => {
      // console.log(e._id);
      return this.taskModel
        .find({
          area: e._id,
          reserve: {
            $elemMatch: {
              start: {
                $gte: new Date(startDay.toISOString()),
                $lte: new Date(stopDay.toISOString()),
              },
            },
          },
          state: {
            $in: ['wait', 'requested', 'accept'],
            $nin: ['drop', 'reject'],
          },
        })
        .lean();
    });
    const tasks: Task[] = (await Promise.all(taskQuery)).flatMap(e => e);
    // console.log('all tsk', tasks);
    const mappedTask = fields.map(e => ({
      ...e,
      disabled: tasks
        .filter(t => String(t.area) === String(e._id))
        .flatMap(fm => fm.reserve)
        .map(d => d.start.toISOString()),
      // disabled: tasks.filter(t => String(t.area) === String(e._id)),
    }));
    // .map(e => ({
    //   ...e,
    //   disabled: e.disabled.map(d => moment(d.start).toISOString()),
    // }));
    // console.log('task', mappedTask);
    return mappedTask;
  }
}
