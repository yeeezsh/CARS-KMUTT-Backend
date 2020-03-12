import { Schema, Document } from 'mongoose';
import { Staff } from '../../users/interfaces/staff.interface';
import { AreaBuilding } from './area.building.interface';

interface Reserve {
  interval: number | -1 | 60;
  max: number;
  start?: Date;
  stop?: Date;
  allDay: boolean;
  week: string | '1-7' | '1,2,3';
}

export interface Area extends Document {
  name: string;
  label?: string;
  building?: AreaBuilding;
  required: {
    form?: Schema.Types.ObjectId; // required form module
    staff?: Staff[];
    requestor: number;
  };
  forward: number;
  reserve: Reserve[];
  createAt: Date;
  updateAt: Date;
}
