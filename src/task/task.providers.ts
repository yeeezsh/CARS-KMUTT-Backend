import { Connection } from 'mongoose';

import { TaskSchema } from './schemas/task.schema';

export const taskProviders = [
    {
        provide: 'TASK_MODEL',
        useFactory: async (connection: Connection) => await connection.model('tasks', TaskSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
