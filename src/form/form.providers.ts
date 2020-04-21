import { Connection } from 'mongoose';
import { FormSchema } from './schemas/form.schema';

export const formProviders = [
  {
    provide: 'FORM_MODEL',
    useFactory: async (connection: Connection) =>
      connection.model('forms', FormSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
