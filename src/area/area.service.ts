import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Area } from './interfaces/area.interface';
import { AreaBuilding } from './interfaces/area.building.interface';
import { CreateAreaBuildingDto } from './dtos/area.building.create.dto';
import { CreateAreaDto } from './dtos/area.create.dto';
import { FormService } from '../form/form.service';
import { UsersService } from '../users/users.service';
import { Moment } from 'moment';
import { AreaAvailble } from './interfaces/area.available.interface';
import { Task } from 'src/task/interfaces/task.interface';
import moment = require('moment');

@Injectable()
export class AreaService {
  constructor(
    @Inject('AREA_MODEL') private readonly areaModel: Model<Area>,
    @Inject('TASK_MODEL') private readonly taskModel: Model<Task>,
    @Inject('AREA_BUILDING_MODEL')
    private readonly areaBuildingModel: Model<AreaBuilding>,
    private readonly formService: FormService,
    private readonly userService: UsersService,
  ) {}

  async createAreaBuilding(data: CreateAreaBuildingDto): Promise<AreaBuilding> {
    try {
      const duplicated = await this.areaBuildingModel.findOne({
        name: data.name,
      });
      if (duplicated) {
        throw new HttpException(
          'name is duplicated',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const doc = new this.areaBuildingModel(data);
      const saved = await doc.save();
      return saved;
    } catch (err) {
      throw err;
    }
  }

  async createArea(data: CreateAreaDto): Promise<Area> {
    try {
      const duplicated = await this.areaModel.findOne({ name: data.name });
      if (duplicated) {
        throw new HttpException('label duplicated', HttpStatus.NOT_ACCEPTABLE);
      }

      // date validation
      data.reserve.forEach(({ start, stop }) => {
        if (new Date(start) > new Date(stop)) {
          throw new HttpException(
            'error time setting',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
      });
      // linking validation
      const formId = data.required.form
        ? await this.formService.linkForm(data.required.form)
        : undefined;
      const buildingId = data.building
        ? await this.linkAreaBuilding(data.building)
        : undefined;
      const staffID = data.required.staff
        ? await Promise.all(
            data.required.staff.map(e => this.userService.linkUser(e, 'staff')),
          )
        : undefined;
      const doc = new this.areaModel({
        ...data,
        building: buildingId,
        required: {
          ...data.required,
          form: formId,
          staff: staffID,
        },
      });
      await doc.save();
      // hotifx
      const saved = await this.areaModel.findById(doc._id).lean();
      return saved;
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

  async linkAreaBuilding(id: string): Promise<AreaBuilding> {
    try {
      const doc = await this.areaBuildingModel.findById(id);
      if (!doc) {
        throw Error('area building by _id is not existing');
      }
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

  async getAreaBuilding(id?: string): Promise<AreaBuilding | AreaBuilding[]> {
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
    const startDay = moment(date);
    const stopDay = moment(startDay).add(maxForward, 'day');
    // console.log('maxforward', maxForward);
    // console.log(startDay.format('DD-MM-YYYY'));
    // console.log(stopDay.format('DD-MM-YYYY'));

    const taskQuery = fields.map(e => {
      // console.log(e._id);
      return this.taskModel
        .find({
          area: e._id,
          createAt: {
            $gte: new Date(startDay.toISOString()),
            $lte: new Date(stopDay.toISOString()),
          },
          cancle: false,
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
