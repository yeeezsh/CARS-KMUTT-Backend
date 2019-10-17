import mongoose, { Schema } from 'mongoose';

export const RequestorSchema = new mongoose.Schema({
    studentId: String,
    email: String,
    password: String,
    createAt: String,
});
