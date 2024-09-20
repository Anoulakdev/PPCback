import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEditMonthPowerPurchaseInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
