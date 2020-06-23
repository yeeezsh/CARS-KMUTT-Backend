import { Schema } from 'mongoose';

export type StaffPermissionType = 'staff' | 'staffLv1' | 'staffLv2' | 'admin';
// !!ORDER IMPORTANT
export const STAFF_PERMISSION: StaffPermissionType[] = [
  'staff',
  'staffLv1',
  'staffLv2',
  'admin',
];

export const StaffSchema = new Schema({
  username: { type: String, required: true },
  password: String,
  email: { type: String, required: true },
  group: {
    type: String,
    required: true,
    enum: STAFF_PERMISSION,
  },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
