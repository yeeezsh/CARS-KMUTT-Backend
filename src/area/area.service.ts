import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Area } from './interfaces/area.interface';
import { AreaBuilding } from './interfaces/area.building.interface';
import { AreaBuildingCreateDto } from './dtos/area.building.create.dto';
import { AreaCreateDto } from './dtos/area.create.dto';

@Injectable()
export class AreaService {
  constructor(
    @Inject('AREA_MODEL') private readonly areaModel: Model<Area>,
    @Inject('AREA_BUILDING_MODEL') private readonly areaBuildingModel: Model<AreaBuilding>,
  ) {}

  async createAreaType(data: AreaBuildingCreateDto): Promise<AreaBuilding> {
    try {
      const duplicated = await this.areaBuildingModel.findOne({
        label: data.label,
      });
      if (duplicated) {
        throw new HttpException('label duplicated', HttpStatus.NOT_ACCEPTABLE);
      }
      const doc = new this.areaBuildingModel(data);
      const saved = await doc.save();
      return saved;
    } catch (err) {
      throw err;
    }
  }

  async createArea(data: AreaCreateDto): Promise<Area> {
    try {
      const duplicated = await this.areaModel.findOne({ label: data.label });
      if (duplicated) {
        throw new HttpException('label duplicated', HttpStatus.NOT_ACCEPTABLE);
      }
      const doc = new this.areaModel(data);
      const saved = await doc.save();
      return saved;
    } catch (err) {
      throw err;
    }
  }

  async listAreaType(): Promise<AreaBuilding[]> {
    try {
      const doc = await this.areaBuildingModel.find({}).lean();
      return doc;
    } catch (err) {
      throw err;
    }
  }

  async listArea(): Promise<Area[]> {
    try {
      const doc = await this.areaModel.find({}).lean();
      return doc;
    } catch (err) {
      throw err;
    }
  }
}
