import { CreateWeekPowerPurchaseInput } from './create-week-power-purchase.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateWeekPowerPurchaseInput extends PartialType(
  CreateWeekPowerPurchaseInput,
) {
  @Field(() => String)
  id: string;
  @Field(() => Boolean, { nullable: true })
  edit: boolean;
}
