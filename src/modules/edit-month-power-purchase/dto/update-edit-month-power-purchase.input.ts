import { CreateEditMonthPowerPurchaseInput } from './create-edit-month-power-purchase.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEditMonthPowerPurchaseInput extends PartialType(
  CreateEditMonthPowerPurchaseInput,
) {
  @Field(() => Int)
  id: number;
}
