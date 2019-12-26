import { Schema } from 'mongoose';

export const AreaSchema = new Schema({
  label: String,
  type: {type: Schema.Types.ObjectId, ref: 'area.types'},
  form: {type: Schema.Types.ObjectId, ref: 'forms'}, // required form module
  maxTask: Number,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
