import { Document } from 'mongoose';

export interface Requestor extends Document {
  username: string;
  studentId?: string;
  email: string;
  name?: {
    firstName: string;
    lastName: string;
  };
  createAt?: Date;
  updateAt?: Date;
}
