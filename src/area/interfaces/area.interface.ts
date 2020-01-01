import { Schema } from 'mongoose';
import { Staff } from 'src/users/interfaces/staff.interface';

interface Reserve {
  interval: number | -1 | 60;
  max: number;
  start?: Date;
  stop?: Date;
  allDay: Boolean;
}

export interface Area {
  _id: Schema.Types.ObjectId;
  name: string;
  building?: Schema.Types.ObjectId;
  required: {
    form?: Schema.Types.ObjectId; // required form module
    staff?: Staff[];
    requestor: number;
  };
  reserve: Reserve[];
  createAt: Date;
  updateAt: Date;
}
