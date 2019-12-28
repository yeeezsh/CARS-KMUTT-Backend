import { Schema } from 'mongoose';

const ReserveSchema = new Schema(
  {
    interval: { type: Number, default: 60 },
    max: { type: Number, default: 1 },
    start: { type: Date, required: true },
    stop: { type: Date, required: true },
  },
  { _id: false },
);

export const AreaSchema = new Schema({
  name: String,
  building: { type: Schema.Types.ObjectId, ref: 'area.buildings' },
  required: {
    form: { type: Schema.Types.ObjectId, ref: 'forms' }, // required form module
    staff: { type: [Schema.Types.ObjectId], ref: 'staffs' },
    requestor: { type: Number, default: 1 },
  },
  reserve: { type: [ReserveSchema], required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
