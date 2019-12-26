import { Connection } from 'mongoose';

import { AreaSchema } from './schemas/area.schema';
import { AreaTypeSchema } from './schemas/area.type.schema';

export const areaProviders = [
  {
    provide: 'AREA_MODEL',
    useFactory: async (connection: Connection) =>
      await connection.model('areas', AreaSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'AREA_TYPE_MODEL',
    useFactory: async (connection: Connection) =>
      await connection.model('area.types', AreaTypeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
