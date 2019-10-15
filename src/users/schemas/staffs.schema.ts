import * as mongoose from 'mongoose';

export const StaffSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  permission: String,
  createAt: Date,
});
