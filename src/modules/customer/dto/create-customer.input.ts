import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateCustomerInput {
  @Field(() => String, { nullable: true })
  villageId?: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  abbreviation: string;

  @Field(() => String)
  company: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  phone: string;

  @Field(() => Int)
  unit: number;

  @Field(() => Float)
  floodLevel: number;

  @Field(() => Float)
  fullLevel: number;

  @Field(() => Float)
  minimumLevel: number;

  @Field(() => Float)
  deadLevel: number;

  @Field(() => Float)
  totalActiveStorage: number;
}
