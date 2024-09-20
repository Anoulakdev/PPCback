import {
  Resolver,
  Query,
  Mutation,
  Subscription,
  Args,
  Int,
} from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { Subscriptions } from './entities/subscription.entity';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { PubSubEngine } from 'graphql-subscriptions';
import { Inject } from '@nestjs/common';

const PONG_EVENT_NAME = 'pong';

@Resolver(() => Subscriptions)
export class SubscriptionResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  // @Mutation(() => Subscriptions)
  // createSubscription(
  //   @Args('createSubscriptionInput')
  //   createSubscriptionInput: CreateSubscriptionInput,
  // ) {
  //   return this.subscriptionService.create(createSubscriptionInput);
  // }

  // @Query(() => [Subscriptions], { name: 'subscription' })
  // findAll() {
  //   return this.subscriptionService.findAll();
  // }

  @Query(() => String, { name: 'ping' })
  findAll() {
    const pingId = Date.now();
    this.pubSub.publish(PONG_EVENT_NAME, pingId);
    return pingId;
  }

  @Subscription(() => Subscriptions)
  pong() {
    const data = this.pubSub.asyncIterator(PONG_EVENT_NAME);
    console.log('data===>', data);
    return data;
  }

  // @Query(() => Subscriptions, { name: 'subscription' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.subscriptionService.findOne(id);
  // }

  // @Mutation(() => Subscriptions)
  // updateSubscription(
  //   @Args('updateSubscriptionInput')
  //   updateSubscriptionInput: UpdateSubscriptionInput,
  // ) {
  //   return this.subscriptionService.update(
  //     updateSubscriptionInput.id,
  //     updateSubscriptionInput,
  //   );
  // }

  // @Mutation(() => Subscription)
  // removeSubscription(@Args('id', { type: () => Int }) id: number) {
  //   return this.subscriptionService.remove(id);
  // }
}
