import { CreateMonthPowerPurchaseInput } from './create-month-power-purchase.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMonthPowerPurchaseInput extends PartialType(
  CreateMonthPowerPurchaseInput,
) {
  @Field(() => String)
  id: string;
  @Field(() => Boolean, { nullable: true })
  edit: boolean;
}
