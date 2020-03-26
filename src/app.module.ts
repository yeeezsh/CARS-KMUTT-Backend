import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { AreaModule } from './area/area.module';
import { FormModule } from './form/form.module';
import { InitModule } from './init/init.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TaskModule,
    AreaModule,
    FormModule,
    InitModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
