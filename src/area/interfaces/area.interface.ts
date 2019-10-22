import { Schema } from 'mongoose';

export interface Area {
    _id: Schema.Types.ObjectId;
    type?: Schema.Types.ObjectId;
    form?: Schema.Types.ObjectId; // required form module
    createAt: Date;
    updateAt: Date;
}
