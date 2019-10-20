import { Schema } from 'mongoose';

export const RequestorSchema = new Schema({
    studentId: String,
    email: String,
    name: {
        firstName: String,
        lastName: String,
    },
    createAt: { type: Date, default: Date.now },
});