import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './users.providers';
import { DateScalar } from '../common/date.scalar';

@Module({
  imports: [DatabaseModule],
  providers: [
    DateScalar,
    UsersService, ...usersProviders,
    UsersResolver,
  ],
})
export class UsersModule { }
