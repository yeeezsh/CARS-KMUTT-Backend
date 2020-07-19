import { Schema } from 'mongoose';
import { StaffDoc } from '../../users/interfaces/staff.interface';
import { AreaBuilding } from './area.building.interface';

interface Reserve {
  interval: number | -1 | 60;
  max: number;
  start?: Date;
  stop?: Date;
  allDay: boolean;
  week: string | '1-7' | '1,2,3';
}

export interface AreaAvailble {
  name: string;
  label?: string;
  building?: AreaBuilding;
  required: {
    form?: Schema.Types.ObjectId; // required form module
    staff?: StaffDoc[];
    requestor: number;
  };
  forward: number;
  disabled: string[];
  reserve: Reserve[];
  createAt: Date;
  updateAt: Date;
}
