import { Schema } from 'mongoose';

export const AreaSchema = new Schema({
  label: String,
  type: Schema.Types.ObjectId,
  form: Schema.Types.ObjectId, // required form module
  maxTask: Number,
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
