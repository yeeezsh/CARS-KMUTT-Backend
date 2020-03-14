import { Schema, Document, Types } from 'mongoose';

export interface StaffAPI {
  _id: undefined | Types.ObjectId;
  username: string;
  email: string;
  // permission: StaffPermission;
  permission: 'staff';
}

export interface StaffDoc extends Document, StaffAPI {
  _id: Types.ObjectId;
  password?: string;
  createAt: Date;
  updateAt: Date;
}

interface StaffPermission {
  position: 'staff' | 'approver' | 'admin';
  approve: boolean;
  permitArea: Schema.Types.ObjectId[] | -1; // -1 meaning all area authorative
}
