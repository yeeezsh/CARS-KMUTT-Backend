import { Schema } from 'mongoose';

interface Option {
    key: string;
    value: string;
}

interface Field {
    key: string;
    value: string;
    type: string;
    options?: [Option];
}

export interface Form {
    _id: Schema.Types.ObjectId;
    label: string;
    fields: [Field];
    required: boolean;
    createAt: Date;
    updateAt: Date;
}
