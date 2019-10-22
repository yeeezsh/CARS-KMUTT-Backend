import { Schema } from 'mongoose';

export const AreaSchema = new Schema({
    type: Schema.Types.ObjectId,
    form: Schema.Types.ObjectId, // required form module
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});