import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Subscriptions {
  @Field(() => String, { nullable: true })
  pong: string;
}
