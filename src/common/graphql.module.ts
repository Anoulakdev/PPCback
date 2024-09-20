import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
// import { IpDev, IpProd } from 'src/shares/ipAddress';
// const ip = process.env.IP === 'prod' ? IpProd : IpDev;
@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      // subscriptions: {
      //   'graphql-ws': true,
      // },
      path: '/v1/api-graphql',
      cors: {
        credentials: true,
        origin: ['http://192.168.20.74:3000'],
        // origin: ['http://localhost:3000'],
      },
    }),
  ],
  // providers: [
  //   {
  //     provide: 'PUB_SUB',
  //     useValue: new PubSub(),
  //   },
  // ],
})
export class GraphqlModule {}
