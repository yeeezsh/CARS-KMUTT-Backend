import { Schema } from 'mongoose';
import { Staff } from 'src/users/interfaces/staff.interface';

export interface Area {
  _id: Schema.Types.ObjectId;
  name: string;
  building?: Schema.Types.ObjectId;
  maxReserve: number;
  required: {
    form?: Schema.Types.ObjectId; // required form module
    staff?: Staff[];
    requestor: number;
  };
  createAt: Date;
  updateAt: Date;
}
