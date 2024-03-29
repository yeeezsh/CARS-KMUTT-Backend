import { Provider } from '@nestjs/common';
import { APP_CONFIG } from './config.constant';
import { ConfigType } from './config.type';
import { ConfigProvider } from './configuration.provider.interface';

export const configProviders: Provider[] = [
  {
    provide: APP_CONFIG,
    useValue: ((): ConfigProvider => {
      const {
        DATABASE_CONNECTION,
        DATABASE_USERAME,
        DATABASE_PASSWORD,
        DATABASE_AUTH_SOURCE,
        JWT_SECRET_KEY,
        JWT_EXPIRES,
        OPS_KEY,
        ORIGIN,
        KMUTT_AUTH,
      } = process.env as ConfigType;
      return {
        database: {
          connection:
            DATABASE_CONNECTION || 'mongodb://mongodb-sharded:27017/cars-kmutt',
          username: DATABASE_USERAME || 'root',
          password: DATABASE_PASSWORD || 'kmuttC@Rs2020',
          authSource: DATABASE_AUTH_SOURCE || 'admin',
        },
        jwt: {
          secretKey: JWT_SECRET_KEY || 'secretKeyJwtEiei',
          expires: JWT_EXPIRES || '3600s',
        },
        opsKey: OPS_KEY || 'kmuttC@Rs2020.OpsKey',
        node_env:
          (process.env.NODE_ENV as ConfigProvider['node_env']) || 'development',
        origin: new RegExp(ORIGIN),
        kmuttAuth: KMUTT_AUTH,
      };
    })(),
  },
];
