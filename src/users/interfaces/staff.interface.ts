import { Schema, Document } from 'mongoose';

// export interface Staff

export interface StaffDoc extends Document {
  username: string;
  password?: string;
  email: string;
  permission: StaffPermission;
  createAt: Date;
  updateAt: Date;
}

interface StaffPermission {
  position: 'staff' | 'approver' | 'admin';
  approve: boolean;
  permitArea: Schema.Types.ObjectId[] | -1; // -1 meaning all area authorative
}
