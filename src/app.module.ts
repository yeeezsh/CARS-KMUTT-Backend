import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import * as GraphQLJSON from 'graphql-type-json';

@Module({
  imports: [
    UsersModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      // resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: 'schema.gql',
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
