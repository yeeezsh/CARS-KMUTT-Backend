import { Schema, Document } from 'mongoose';

export interface AreaBuilding extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  type: 'sport' | 'area';
  category?: string;
  createAt: Date;
  updateAt: Date;
}
