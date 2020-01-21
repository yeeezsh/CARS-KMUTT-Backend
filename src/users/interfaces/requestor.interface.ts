import { Schema, Document } from 'mongoose';

export interface Requestor extends Document {
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
