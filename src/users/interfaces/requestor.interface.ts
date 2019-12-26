import { Schema } from 'mongoose';

export interface Requestor {
  _id: Schema.Types.ObjectId;
  username: string;
  studentId?: string;
  email: string;
  name?: {
    firstName: string;
    lastName: string;
  };
  createAt: Date;
}
