export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    connection:
      process.env.DATABASE_HOST || 'mongodb://mongodb-sharded:27017/cars-kmutt',
    username: process.env || 'root',
    password: '' || 'kmuttC@Rs2020',
    authSource: '' || 'admin',
  },
  jwt: {
    secretKey: '' || 'secretKeyJwtEiei',
    expires: '' || '3600s',
  },
});
