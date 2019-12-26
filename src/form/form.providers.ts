import { Connection } from 'mongoose';
import { FormSchema } from './schemas/form.schema';

export const formProviders = [
  {
    provide: 'FORM_MODEL',
    useFactory: async (connection: Connection) =>
      await connection.model('forms', FormSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
