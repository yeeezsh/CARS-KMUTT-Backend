import { Document } from 'mongoose';

export interface AreaBuilding extends Document {
  name: string;
  label?: string;
  type: 'sport' | 'area' | 'meeting';
  createAt: Date;
  updateAt: Date;
}
