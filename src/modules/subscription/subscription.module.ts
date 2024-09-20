import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResolver } from './subscription.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    SubscriptionResolver,
    SubscriptionService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class SubscriptionModule {}
