import { Schema, Document } from 'mongoose';
import { Staff } from 'src/users/interfaces/staff.interface';

interface Reserve {
  interval: number | -1 | 60;
  max: number;
  start?: Date;
  stop?: Date;
  allDay: boolean;
}

export interface Area extends Document {
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
