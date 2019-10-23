import { Schema } from 'mongoose';

export const TaskSchema = new Schema({
    time: {
        start: Date,
        stop: Date,
    },
    requestor: Schema.Types.ObjectId,
    state: [String],
    staff: Schema.Types.ObjectId,
    // area: null,
    // form: null,
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});
