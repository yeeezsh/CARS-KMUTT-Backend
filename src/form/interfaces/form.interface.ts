import { Schema } from 'mongoose';

interface Option {
    key: string;
    value: string;
}

interface Field {
    key: string;
    value: string;
    type: string;
    required?: boolean;
    options?: [Option];
}

export interface Form {
    _id: Schema.Types.ObjectId;
    label: string;
    fields: [Field];
    createAt: Date;
    updateAt: Date;
}
