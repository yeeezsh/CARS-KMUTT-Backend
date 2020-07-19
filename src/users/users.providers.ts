import { Connection } from 'mongoose';
import { RequestorSchema } from './schemas/requestor.schema';
// schemas
import { StaffSchema } from './schemas/staffs.schema';

export const usersProviders = [
  {
    provide: 'STAFF_MODEL',
    useFactory: async (connection: Connection) =>
      connection.model('staffs', StaffSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'REQUESTOR_MODEL',
    useFactory: async (connection: Connection) =>
      connection.model('requestors', RequestorSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
