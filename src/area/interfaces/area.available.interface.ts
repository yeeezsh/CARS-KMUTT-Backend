import { Schema, Document } from 'mongoose';
import { Staff } from '../../users/interfaces/staff.interface';
import { Moment } from 'moment';

interface Reserve {
  interval: number | -1 | 60;
  max: number;
  start?: Date;
  stop?: Date;
  allDay: boolean;
  week: string | '1-7' | '1,2,3';
}

export interface AreaAvailble {
  _id: Schema.Types.ObjectId;
  name: string;
  label?: string;
  building?: Schema.Types.ObjectId;
  required: {
    form?: Schema.Types.ObjectId; // required form module
    staff?: Staff[];
    requestor: number;
  };
  forward: number;
  disabled: string[];
  reserve: Reserve[];
  createAt: Date;
  updateAt: Date;
}
