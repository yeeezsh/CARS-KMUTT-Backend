import { Schema } from 'mongoose';
import { Staff } from 'src/users/interfaces/staff.interface';

export interface Area {
  _id: Schema.Types.ObjectId;
  name: string;
  type?: Schema.Types.ObjectId;
  form?: Schema.Types.ObjectId; // required form module
  staffRequired?: Staff[];
  maxTask: number;
  createAt: Date;
  updateAt: Date;
}
