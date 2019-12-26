import { Schema } from 'mongoose';

export interface AreaBuilding {
  _id: Schema.Types.ObjectId;
  label: string;
  createAt: Date;
  updateAt: Date;
}
