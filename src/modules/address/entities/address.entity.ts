import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Address {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
