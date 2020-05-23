import { Schema } from 'mongoose';

export const AreaBuildingSchema = new Schema({
  name: String,
  label: String,
  type: {
    type: String,
    required: true,
    enum: ['sport', 'area', 'meeting', 'common', 'common-sport'],
  },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
