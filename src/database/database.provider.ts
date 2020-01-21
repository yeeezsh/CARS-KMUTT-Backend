import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect('mongodb://mongodb-sharded:27017/cars-kmutt', {
        user: 'root',
        pass: 'kmuttC@Rs2020',
        authSource: 'admin',
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }),
  },
];
