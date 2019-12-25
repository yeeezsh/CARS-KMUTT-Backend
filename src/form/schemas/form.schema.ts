import { Schema } from 'mongoose';

const option = {
    key: String,
    value: String,
};

const field = {
    key: String,
    value: String,
    type: String,
    options: [option],
    required: { type: Boolean, default: false },
};

export const FormSchema = new Schema({
    label: String,
    fields: [field],
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});
