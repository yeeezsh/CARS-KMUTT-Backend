import { Document, Types } from 'mongoose';
import { StaffPermissionType } from '../schemas/staffs.schema';

export interface Staff {
  _id: undefined | Types.ObjectId;
  username: string;
  email: string;
  group: StaffPermissionType;
}

export interface StaffDoc extends Document, Staff {
  _id: Types.ObjectId;
  password?: string;
  createAt: Date;
  updateAt: Date;
}

// interface StaffPermission {
//   position: 'staff' | 'approver' | 'admin';
//   approve: boolean;
//   permitArea: Types.ObjectId[] | -1; // -1 meaning all area authorative
// }
