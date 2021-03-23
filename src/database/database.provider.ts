import { Provider } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { APP_CONFIG } from 'src/config/config.constant';
import { ConfigProvider } from 'src/config/configuration.interface';

export const databaseProviders: Provider[] = [
  {
    inject: [APP_CONFIG],
    provide: 'DATABASE_CONNECTION',
    useFactory: async (appConfig: ConfigProvider): Promise<typeof mongoose> => {
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
