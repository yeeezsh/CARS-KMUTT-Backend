import { Document } from 'mongoose';
import { AreaBuildingType } from './building.type';

export interface AreaBuilding extends Document {
  name: string;
  label?: string;
  type: AreaBuildingType;
  createAt: Date;
  updateAt: Date;
}
