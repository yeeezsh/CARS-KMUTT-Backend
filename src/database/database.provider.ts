import { Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ConfigurationInterface } from 'src/config/configuration.interface';
// import { ConfigModule } from '../config/config.module';

export const databaseProviders: Provider[] = [
  {
    inject: ['APP_CONFIG'],
    provide: 'DATABASE_CONNECTION',
    useFactory: async (
      appConfig: ConfigurationInterface,
    ): Promise<typeof mongoose> => {
      console.log(appConfig.database.authSource);
      return await mongoose.connect(
        'mongodb://mongodb-sharded:27017/cars-kmutt',
        {
          user: 'root',
          pass: 'kmuttC@Rs2020',
          authSource: 'admin',
          useCreateIndex: true,
          useNewUrlParser: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        },
      );
    },
  },
];
