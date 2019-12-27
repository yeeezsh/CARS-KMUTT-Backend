import { Schema } from 'mongoose';

export const AreaSchema = new Schema({
  name: String,
  building: { type: Schema.Types.ObjectId, ref: 'area.buildings' },
  form: { type: Schema.Types.ObjectId, ref: 'forms' }, // required form module
  maxTask: Number,
  staffRequired: { type: [Schema.Types.ObjectId], ref: 'staffs' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
