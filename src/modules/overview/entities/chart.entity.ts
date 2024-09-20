import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Chart {
  @Field(() => [Int], { nullable: 'items' })
  declarations: number[];

  @Field(() => [Int], { nullable: 'items' })
  dispatchs: number[];

  @Field(() => [Float])
  labels: number[];

  @Field(() => Float)
  min: number;

  @Field(() => Float)
  max: number;
}
