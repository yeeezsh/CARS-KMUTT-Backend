import { Schema } from 'mongoose';

const TimeSchema = new Schema(
  {
    start: Date,
    stop: Date,
    allDay: { type: Boolean, default: false },
  },
  { _id: false },
);

const Requestor = new Schema(
  {
    username: { type: String, required: true },
    confirm: { type: Boolean, default: false },
  },
  { _id: false },
);

export const TaskSchema = new Schema({
  reserve: [TimeSchema],
  requestor: { type: [Requestor], index: true, required: true },
  state: [String],
  staff: { type: [Schema.Types.ObjectId], ref: 'staffs', index: true },
  area: { type: Schema.Types.ObjectId, ref: 'areas', index: true },
  // form: { type: Schema.Types.ObjectId, ref: 'forms' },
  form: Object,
  desc: String,

  createAt: { type: Date, default: Date.now, index: true },
  updateAt: { type: Date, default: Date.now },
});
