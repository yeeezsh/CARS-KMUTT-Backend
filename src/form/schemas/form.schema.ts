import { Schema } from 'mongoose';

const option = new Schema({
  key: String,
  label: String,
  value: String,
});

const field = new Schema({
  key: String,
  label: String,
  value: String,
  type: String,
  options: [option],
  required: { type: Boolean, default: false },
});

export const FormSchema = new Schema({
  label: String,
  fields: [field],
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
