import { ConfigurationInterface } from './configuration.interface';

export default (): ConfigurationInterface => ({
  database: {
    connection:
      process.env.DATABASE_HOST || 'mongodb://mongodb-sharded:27017/cars-kmutt',
    username: process.env.DATABASE_USERAME || 'root',
    password: '' || 'kmuttC@Rs2020',
    authSource: '' || 'admin',
  },
  jwt: {
    secretKey: '' || 'secretKeyJwtEiei',
    expires: '' || '3600s',
  },
  opsKey: '' || 'kmuttC@Rs2020.OpsKey',
  node_env:
    (process.env.NODE_ENV as ConfigurationInterface['node_env']) ||
    'development',
});
