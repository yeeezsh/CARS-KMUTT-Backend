import { Schema } from 'mongoose';

const ReserveSchema = new Schema(
  {
    interval: { type: Number, default: 60 },
    max: { type: Number, default: 1 },
    start: Date,
    stop: Date,
    allDay: { type: Boolean, default: false },
  },
  { _id: false },
);

export const AreaSchema = new Schema({
  name: String,
  label: String,
  building: { type: Schema.Types.ObjectId, ref: 'area.buildings' },
  required: {
    form: { type: Schema.Types.ObjectId, ref: 'forms' }, // required form module
    staff: { type: Number, default: 1 },
    requestor: { type: Number, default: 1 },
  },
  reserve: { type: [ReserveSchema], required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
