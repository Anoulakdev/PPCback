import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class SummaryEnergy {
  @Field(() => Int)
  declaration: number;

  @Field(() => Int)
  dispatch: number;
}
