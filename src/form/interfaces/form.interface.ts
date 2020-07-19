import { Document, Schema } from 'mongoose';

interface Option {
  key: string;
  label?: string;
  value: string;
}

interface Field {
  key: string;
  label?: string;
  value: string;
  type: 'text' | 'checkbox' | 'radio' | 'date' | 'upload' | 'textarea';
  required?: boolean;
  options?: [Option];
}

export interface Form extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  fields: [Field];
  createAt: Date;
  updateAt: Date;
}
