import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Moment } from 'moment';
import { Model, Types } from 'mongoose';
import weekParse from 'src/task/helpers/week.parse';
import { TaskDoc } from 'src/task/interfaces/task.interface';
import { TaskTimeSlot } from 'src/task/interfaces/task.time.slot.interface';
import { AreaAvailble } from './interfaces/area.available.interface';
import { AreaAvailableStaff } from './interfaces/area.available.staff.interface';
import { AreaBuilding } from './interfaces/area.building.interface';
import { AreaAPI, AreaDoc } from './interfaces/area.interface';
import { AreaTableAPI } from './interfaces/area.table.interface';
import { TimeNode } from './interfaces/timenode.interface';

import moment = require('moment');

@Injectable()
export class AreaQueryService {
  constructor(
    @Inject('AREA_MODEL') private readonly areaModel: Model<AreaDoc>,
    @Inject('TASK_MODEL') private readonly taskModel: Model<TaskDoc>,
    @Inject('AREA_BUILDING_MODEL')
    private readonly areaBuildingModel: Model<AreaBuilding>,
  ) {}

  private async getReservedAreaTimeInOneDay(
    areaId: string | Types.ObjectId,
    date?: Moment,
  ): Promise<TimeNode[]> {
    if (!date) return;

    return await this.taskModel.aggregate([
      {
        $match: {
          area: new Types.ObjectId(areaId),
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

      const today = moment(moment()).startOf('day');
      const forward = area.forward;
      const weeks = weekParse(area.reserve[0].week);
      const validDay = Array(forward)
        .fill([])
        .map((_e, i) => {
          const day = moment(today).add(i, 'day');
          if (weeks.includes(Number(day.format('E')))) {
            return {
              // HOT FIX for overlaps day
              date: moment(day).subtract(1, 'day'),
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
        // HOT FIX bad overlaps day
        date: e && new Date(e.date.subtract(1, 'day').toISOString()),
      }));

      return mapped;
    } catch (err) {
      throw err;
    }
  }

  async getAvailableMeetingArea(areaId: string, date: string) {
    // console.log('getAvailableMeetingArea');
    // const today = moment()
    const lowerBound = moment(date).startOf('day');
    const upperBound = moment(lowerBound).add(1, 'day');
    // console.log('l', lowerBound.format('DD - MM - YYYY'));
    // console.log('u', upperBound.format('DD - MM - YYYY'));
    const validArea = await this.areaModel
      .findOne({ _id: areaId })
      .select('_id reserve');
    const interval: number = validArea.reserve[0].interval;
    if (!validArea) throw new BadRequestException('bad area id');
    const tasks = await this.taskModel
      .find({
        area: areaId,
        type: {
          $in: ['meeting-room', 'meeting-club'],
        },
        state: {
          $in: ['wait', 'requested', 'accept'],
          $nin: ['drop', 'reject'],
        },
        reserve: {
          $elemMatch: {
            start: {
              $gte: new Date(lowerBound.toISOString()),
              $lte: new Date(upperBound.toISOString()),
            },
          },
        },
      })
      .select('reserve')
      .lean();
    const parse = tasks.map(e => e.reserve).flatMap(e => e);
    const mapped = parse
      .map((e: TaskTimeSlot) => {
        const start = moment(e.start);
        const stop = moment(e.stop);
        let cur = start;
        let merge = [];
        while (cur.valueOf() <= stop.valueOf()) {
          merge.push({
            value: cur.toDate(),
            type: 'disabled',
          });
          cur = moment(cur).add(interval, 'minute');
        }
        return merge;
      })
      .flatMap(e => e);
    // console.log('tasks', tasks);
    // console.log('tasks', parse, interval);
    // console.log(mapped);
    return mapped;
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

  async listArea(): Promise<AreaDoc[]> {
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

  async getArea(id: string): Promise<AreaAPI> {
    try {
      const doc = await this.areaModel
        .findById(id)
        .populate('building', 'name label')
        .lean();
      if (!doc) {
        throw Error('_id is not exisiting');
      }
      return doc;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @param  {string} id? when null is query all possible
   * @returns Promise
   */
  async getAreaSportBuilding(id?: string): Promise<AreaBuilding[]> {
    try {
      return this.getAreaBuilding(id, { type: 'sport' });
    } catch (err) {
      throw err;
    }
  }

  async getAreaCommonBuilding(
    id?: string,
  ): Promise<{
    label: string;
    name: string;
  }> {
    try {
      const buildingListId = (
        await this.getAreaBuilding(id, {
          type: {
            $in: ['common', 'common-sport'],
          },
        })
      ).map(e => e._id);
      const mappedArea = await this.areaModel
        .find({
          building: {
            $in: buildingListId,
          },
        })
        .select('name label');
      return mappedArea as any;
    } catch (err) {
      throw err;
    }
  }

  async getAreaCommonMeeting(id?: string): Promise<AreaAPI[]> {
    try {
      // const areaBuildingList = await this.getAreaBuilding(id, {
      //   type: {
      //     $or: ['meeting', 'meeting-club'],
      //   },
      // });
      const areaBuildingList = await this.areaBuildingModel
        .find({
          type: {
            // DANGER MUST MIGRATE TO MEETING-ROOM
            $in: ['meeting', 'meeting-club'],
          },
        })
        .select('_id');
      const areaList = this.areaModel
        .find({
          building: {
            $in: [...areaBuildingList.map(e => e._id)],
          },
        })
        .populate('building')
        .lean();

      return areaList;
    } catch (err) {
      throw err;
    }
  }

  // tslint:disable-next-line: variable-name
  async getAreaBuilding(_id?: string, query?: {}): Promise<AreaBuilding[]> {
    try {
      const rawQuery = _id ? { ...query, _id } : { ...query };
      const doc = await this.areaBuildingModel.find(rawQuery).lean();

      if (!doc) {
        throw Error('_id is not exisiting');
      }
      return doc;
    } catch (err) {
      throw err;
    }
  }

  async getSportAreaFields(id: string): Promise<AreaDoc[]> {
    return await this.areaModel.find({ building: id }).lean();
  }

  async getAvailableSportAreaFields(
    id: string,
    date: Moment,
  ): Promise<AreaAvailble[]> {
    const fields: AreaDoc[] = await this.areaModel
      .find({ building: id })
      .lean();
    // const maxForward = fields.reduce((prev, cur) =>
    //   prev.forward > cur.forward ? prev : cur,
    // ).forward;
    const startDay = moment(moment(date).startOf('day'));
    const stopDay = moment(startDay).add(1, 'day');

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
    const tasks: TaskDoc[] = (await Promise.all(taskQuery)).flatMap(e => e);
    const mappedTask = fields.map(e => ({
      ...e,
      disabled: tasks
        .filter(t => String(t.area) === String(e._id))
        .flatMap(fm => fm.reserve)
        .map(d => d.start.toISOString()),
    }));

    return mappedTask;
  }
}
