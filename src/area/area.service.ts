import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { FormService } from '../form/form.service';
import { UsersService } from '../users/users.service';
import { CreateAreaBuildingDto } from './dtos/area.building.create.dto';
import { CreateAreaDto } from './dtos/area.create.dto';
import { AreaBuildingDoc } from './interfaces/area.building.interface';
import { Area, AreaDoc } from './interfaces/area.interface';

@Injectable()
export class AreaService {
  constructor(
    @Inject('AREA_MODEL') private readonly areaModel: Model<AreaDoc>,
    @Inject('AREA_BUILDING_MODEL')
    private readonly areaBuildingModel: Model<AreaBuildingDoc>,
    private readonly formService: FormService,
    private readonly userService: UsersService,
  ) {}

  async createAreaBuilding(
    data: CreateAreaBuildingDto,
  ): Promise<AreaBuildingDoc> {
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

  async linkAreaBuilding(id: string): Promise<AreaBuildingDoc> {
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
}
