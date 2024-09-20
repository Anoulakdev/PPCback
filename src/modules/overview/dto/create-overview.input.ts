import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateOverviewInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
