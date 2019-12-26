import { Schema } from 'mongoose';

const option = new Schema(
  {
    key: String,
    label: String,
    value: [String],
  },
  { _id: false },
);

const field = new Schema(
  {
    key: String,
    label: String,
    value: [String],
    type: String,
    options: [option],
    required: { type: Boolean, default: false },
  },
  { _id: false },
);

export const FormSchema = new Schema({
  name: String,
  fields: [field],
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
