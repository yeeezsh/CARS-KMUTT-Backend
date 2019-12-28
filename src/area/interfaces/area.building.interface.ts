import { Schema } from 'mongoose';

export interface AreaBuilding {
  _id: Schema.Types.ObjectId;
  name: string;
  type: 'sport' | 'area';
  createAt: Date;
  updateAt: Date;
}
