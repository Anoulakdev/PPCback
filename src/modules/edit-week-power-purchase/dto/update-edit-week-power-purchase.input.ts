import { CreateEditWeekPowerPurchaseInput } from './create-edit-week-power-purchase.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEditWeekPowerPurchaseInput extends PartialType(
  CreateEditWeekPowerPurchaseInput,
) {
  @Field(() => Int)
  id: number;
}
