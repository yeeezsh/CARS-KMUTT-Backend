import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { AreaModule } from './area/area.module';
import { FormModule } from './form/form.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      context: ({ req }) => ({ req }),
      // resolvers: { JSON: GraphQLJSON },
      // context: ({ req }) => ({ req }),
      // autoSchemaFile: 'schema.gql',
    }),
    AuthModule,
    UsersModule,
    TaskModule,
    AreaModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
