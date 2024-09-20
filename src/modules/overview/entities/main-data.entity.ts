import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class MainData {
  @Field(() => Float)
  day: number;

  @Field(() => Float)
  week: number;

  @Field(() => Float)
  month: number;
}
