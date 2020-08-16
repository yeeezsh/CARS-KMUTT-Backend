import { Schema } from 'mongoose';
import { STAFF_PERMISSION } from 'src/users/schemas/staffs.schema';
import { Task, TASK_STATE, TASK_TYPE } from '../interfaces/task.interface';

const TimeSchema = new Schema(
  {
    start: { type: Date, index: true },
    stop: { type: Date, index: true },
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

const StaffRequest = new Schema(
  {
    group: {
      type: String,
      required: true,
      enum: STAFF_PERMISSION,
    },
    id: {
      type: [String],
    },
    approve: { type: Boolean, default: false },
  },
  { _id: false },
);

const Desc = new Schema(
  {
    msg: { type: String, index: false },
    createAt: { type: Date, default: Date.now, index: false },
  },
  { _id: false },
);

export const TaskSchema = new Schema<Task>({
  vid: { type: String, required: true, index: true },
  reserve: [TimeSchema],
  requestor: { type: [Requestor], index: true, required: true },
  state: { type: [String], enum: TASK_STATE, index: true },
  staff: { type: [StaffRequest], ref: 'staffs', index: true },
  area: { type: Schema.Types.ObjectId, ref: 'areas', index: true },
  building: { type: Schema.Types.ObjectId, ref: 'area.buildings', index: true },
  forms: [],
  desc: { type: [Desc], required: false },

  // use for common/area reserve
  type: {
    type: String,
    enum: TASK_TYPE,
    index: true,
  },

  createAt: { type: Date, default: Date.now, index: true },
  updateAt: { type: Date, default: Date.now },
});
