import { TimeNode } from './timenode.interface';
import { Types } from 'mongoose';

export interface AreaAvailableStaff {
  _id: string | Types.ObjectId;
  name: string;
  label: string;
  building: {
    _id: string;
    name: string;
    label: string;
  };
  disabled: TimeNode[];
  date: Date;
}
