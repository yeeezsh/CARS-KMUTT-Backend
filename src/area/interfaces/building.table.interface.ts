import { Types } from 'mongoose';
import { AreaBuildingType } from './building.type';

export interface BuildingTableAPI {
  _id: Types.ObjectId;
  key: string;
  name: string;
  type: AreaBuildingType;
  label: string;
  areas: Array<{
    _id: Types.ObjectId;
    name: string;
    label: string;
  }>;
}
