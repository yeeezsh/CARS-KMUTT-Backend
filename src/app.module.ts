import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import * as GraphQLJSON from 'graphql-type-json';

@Module({
  imports: [
    UsersModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      // resolvers: { JSON: GraphQLJSON },
      autoSchemaFile: 'schema.gql',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
