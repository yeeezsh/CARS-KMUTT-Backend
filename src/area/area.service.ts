import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Area } from './interfaces/area.interface';
import { AreaType } from './interfaces/area.type.interface';
import { AreaTypeDto } from './dtos/area.type.dto';
import { AreaDto } from './dtos/area.dto';

@Injectable()
export class AreaService {

    constructor(
        @Inject('AREA_MODEL') private readonly areaModel: Model<Area>,
        @Inject('AREA_TYPE_MODEL') private readonly areaTypeModel: Model<AreaType>,
    ) { }

    async createAreaType(data: AreaTypeDto): Promise<AreaType> {
        try {
            const duplicated = this.areaTypeModel.findOne({ label: data.label })
            if (duplicated) {
                throw new HttpException('label duplicated', HttpStatus.UNAUTHORIZED);
            }
            const doc = new this.areaTypeModel(data);
            const saved = await doc.save();
            return saved;
        } catch (err) {
            throw err;
        }
    }

    async createArea(data: AreaDto): Promise<Area> {
        try {
            const duplicated = this.areaModel.findOne({ label: data.label });
            if (duplicated) {
                throw new HttpException('label duplicated', HttpStatus.UNAUTHORIZED);
            }
            const doc = new this.areaModel(data);
            const saved = await doc.save();
            return saved;
        } catch (err) {
            throw err;
        }
    }

    async listAreaType(): Promise<AreaType[]> {
        try {
            const doc = this.areaTypeModel.find({}).lean();
            return doc;
        } catch (err) {
            throw err;
        }
    }

    async listArea(): Promise<Area[]> {
        try {
            const doc = this.areaModel.find({}).lean();
            return doc;
        } catch (err) {
            throw err;
        }
    }

}
