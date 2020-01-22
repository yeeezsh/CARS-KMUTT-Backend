import { Schema, Document } from 'mongoose';

export interface AreaBuilding extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  label?: string;
  type: 'sport' | 'area';
  createAt: Date;
  updateAt: Date;
}
