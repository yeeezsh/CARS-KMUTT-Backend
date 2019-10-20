// import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const StaffSchema = new Schema({
  username: String,
  password: String,
  email: String,
  permission: String,
  createAt: Date,
});
