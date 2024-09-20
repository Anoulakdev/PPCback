import { CreateEditDayPowerPurchaseInput } from './create-edit-day-power-purchase.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEditDayPowerPurchaseInput extends PartialType(
  CreateEditDayPowerPurchaseInput,
) {
  @Field(() => Int)
  id: number;
}
