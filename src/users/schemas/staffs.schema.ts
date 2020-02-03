// import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const StaffSchema = new Schema({
  username: { type: String, required: true },
  password: String,
  email: { type: String, required: true },
  permission: {
    type: String,
    required: true,
    enum: ['staff', 'approver', 'admin'],
  },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
