import { Schema } from 'mongoose';

export const TaskSchema = new Schema({
  time: {
    start: Date,
    stop: Date,
  },
  requestor: { type: Schema.Types.ObjectId, ref: 'requestors' },
  state: [String],
  staff: { type: Schema.Types.ObjectId, ref: 'staffs' },
  area: { type: Schema.Types.ObjectId, ref: 'areas' },
  form: { type: Schema.Types.ObjectId, ref: 'forms' },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
