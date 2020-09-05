import { Document, Schema } from 'mongoose';
import { StaffDoc } from '../../users/interfaces/staff.interface';

interface Reserve {
  interval: number | -1 | 60;
  max: number;
  start?: Date;
  stop?: Date;
  allDay: boolean;
  week: string | '1-7' | '1,2,3';
}

export interface Area {
  name: string;
  label?: string;
  building?: string;
  required: {
    form?: Schema.Types.ObjectId; // required form module
    staff?: StaffDoc[];
    requestor: number;
  };
  forward: number;
  reserve: Reserve[];
  createAt: Date;
  updateAt: Date;
}

export interface AreaDoc extends Area, Document {}
export interface AreaAPI extends Area {
  _id: string;
}
