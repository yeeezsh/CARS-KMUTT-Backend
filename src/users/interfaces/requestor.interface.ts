import { Schema } from 'mongoose';

export interface Requestor {
    _id: Schema.Types.ObjectId;
    stId?: string;
    email: string;
    name?: {
        firstName: string,
        lastName: string,
    };
    createAt: Date;
}
