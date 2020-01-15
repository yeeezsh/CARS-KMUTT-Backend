import { Schema, Document } from 'mongoose';

export interface Staff extends Document {
  _id: Schema.Types.ObjectId;
  username: string;
  password?: string;
  email: string;
  permission: StaffPermission;
  createAt: Date;
}

interface StaffPermission extends Document {
  position: 'staff' | 'approver' | 'admin';
  approve: boolean;
  permitArea: Schema.Types.ObjectId[] | -1;
}
