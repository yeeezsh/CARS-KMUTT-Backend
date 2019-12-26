import { Schema } from 'mongoose';

export interface Area {
  _id: Schema.Types.ObjectId;
  name: string;
  type?: Schema.Types.ObjectId;
  form?: Schema.Types.ObjectId; // required form module
  maxTask: number;
  createAt: Date;
  updateAt: Date;
}
