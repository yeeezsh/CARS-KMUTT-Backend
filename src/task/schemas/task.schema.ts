import { Schema } from 'mongoose';

const TimeSchema = new Schema(
  {
    date: Date,
    start: Date,
    stop: Date,
  },
  { _id: false },
);

export const TaskSchema = new Schema({
  time: [TimeSchema],
  requestor: { type: Schema.Types.ObjectId, ref: 'requestors' },
  state: [String],
  staff: { type: [Schema.Types.ObjectId], ref: 'staffs' },
  area: { type: Schema.Types.ObjectId, ref: 'areas' },
  form: { type: Schema.Types.ObjectId, ref: 'forms' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
