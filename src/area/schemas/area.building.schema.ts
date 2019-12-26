import { Schema } from 'mongoose';

export const AreaBuildingSchema = new Schema({
  label: String,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
