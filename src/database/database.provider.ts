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
      return await mongoose.connect(appConfig.database.connection, {
        user: appConfig.database.username,
        pass: appConfig.database.password,
        authSource: appConfig.database.authSource,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
    },
  },
];
