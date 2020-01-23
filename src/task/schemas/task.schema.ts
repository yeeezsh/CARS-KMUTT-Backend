import { Schema } from 'mongoose';

const TimeSchema = new Schema(
  {
    start: Date,
    stop: Date,
    allDay: { type: Boolean, default: false },
  },
  { _id: false },
);

export const TaskSchema = new Schema({
  reserve: [TimeSchema],
  requestor: { type: [Schema.Types.ObjectId], ref: 'requestors' },
  state: [String],
  staff: { type: [Schema.Types.ObjectId], ref: 'staffs' },
  approve: [Boolean],
  area: { type: Schema.Types.ObjectId, ref: 'areas' },
  form: { type: Schema.Types.ObjectId, ref: 'forms' },

  cancle: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
