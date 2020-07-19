import { Connection } from 'mongoose';
import { AreaBuildingSchema } from './schemas/area.building.schema';
import { AreaSchema } from './schemas/area.schema';

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
