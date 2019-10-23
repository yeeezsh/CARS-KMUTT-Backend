import { Schema } from 'mongoose';

export interface AreaType {
    _id: Schema.Types.ObjectId;
    label: string;
    createAt: Date;
    updateAt: Date;
}
