import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DatabaseModule } from 'src/database/database.module';
import { databaseProviders } from 'src/database/database.provider';
import { GridFsMulterConfigService } from './file.config';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.registerAsync({
      imports: [DatabaseModule],
      useClass: GridFsMulterConfigService,
      inject: [...databaseProviders],
    }),
  ],
  controllers: [FileController],
  providers: [FileService, ...databaseProviders],
})
export class FileModule {}
