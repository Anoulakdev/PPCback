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
        origin: ['http://localhost:3000'], //'http://150.95.30.174:4041',
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
