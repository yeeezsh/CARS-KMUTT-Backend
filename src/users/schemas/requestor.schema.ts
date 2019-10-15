import * as mongoose from 'mongoose';

export const StaffSchema = new mongoose.Schema({
    studentId: String,
    email: String,
    password: String,
    createAt: String,
});
