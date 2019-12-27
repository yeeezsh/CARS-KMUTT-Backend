import { Schema } from 'mongoose';

export const AreaSchema = new Schema({
  name: String,
  building: { type: Schema.Types.ObjectId, ref: 'area.buildings' },
  maxReserve: {type: Number, default: 1},
  required: {
    form: { type: Schema.Types.ObjectId, ref: 'forms' }, // required form module
    staff: { type: [Schema.Types.ObjectId], ref: 'staffs' },
    requestor: { type: Number, default: 1 },
  },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
