import { Schema } from 'mongoose';

export const RequestorSchema = new Schema({
    studentId: String,
    email: String,
    password: String,
    createAt: String,
});
