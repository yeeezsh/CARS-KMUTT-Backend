import { Connection } from 'mongoose';
import { StaffSchema } from './schemas/staffs.schema';

export const usersProviders = [
    {
        provide: 'STAFF_MODEL',
        useFactory: async (connection: Connection) => await connection.model('staffs', StaffSchema),
        inject: ['DATABASE_CONNECTION'],
    }
]