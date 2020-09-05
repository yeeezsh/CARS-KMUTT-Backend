import { Document } from 'mongoose';
import { AreaBuildingType } from './building.type';

export interface AreaBuilding {
  name: string;
  label?: string;
  type: AreaBuildingType;
  createAt: Date;
  updateAt: Date;
}

export interface AreaBuildingDoc extends AreaBuilding, Document {}
