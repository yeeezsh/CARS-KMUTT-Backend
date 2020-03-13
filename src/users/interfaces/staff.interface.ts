import { Schema, Document } from 'mongoose';

export interface StaffAPI {
  username: string;
  email: string;
  permission: StaffPermission;
}

export interface StaffDoc extends Document, StaffAPI {
  password?: string;
  createAt: Date;
  updateAt: Date;
}

interface StaffPermission {
  position: 'staff' | 'approver' | 'admin';
  approve: boolean;
  permitArea: Schema.Types.ObjectId[] | -1; // -1 meaning all area authorative
}
