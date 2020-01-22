import { Schema } from 'mongoose';

export const AreaBuildingSchema = new Schema({
  name: String,
  label: String,
  type: { type: String, required: true, enum: ['sport', 'area'] },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
