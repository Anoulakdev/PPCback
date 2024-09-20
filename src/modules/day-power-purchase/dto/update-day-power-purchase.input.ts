import { CreateDayPowerPurchaseInput } from './create-day-power-purchase.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDayPowerPurchaseInput extends PartialType(
  CreateDayPowerPurchaseInput,
) {
  @Field(() => String)
  id: string;
  @Field(() => Boolean, { nullable: true })
  edit: boolean;
}
