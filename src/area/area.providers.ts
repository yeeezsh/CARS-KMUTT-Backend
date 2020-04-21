import { Connection } from 'mongoose';

import { AreaSchema } from './schemas/area.schema';
import { AreaBuildingSchema } from './schemas/area.building.schema';

export const areaProviders = [
  {
    provide: 'AREA_MODEL',
    useFactory: async (connection: Connection) =>
      connection.model('areas', AreaSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'AREA_BUILDING_MODEL',
    useFactory: async (connection: Connection) =>
      connection.model('area.buildings', AreaBuildingSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
