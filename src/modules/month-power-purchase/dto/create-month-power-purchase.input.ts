import { InputType, Field } from '@nestjs/graphql';
import { PowerDetailInput } from 'src/modules/day-power-purchase/dto/power.input';

@InputType()
export class CreateMonthPowerPurchaseInput {
  @Field(() => String)
  customerId: string;

  @Field(() => [PowerDetailInput])
  powerDetail: PowerDetailInput[];

  @Field(() => [String])
  powers: string[];

  @Field(() => [String])
  remarks: string[];

  @Field(() => String, { nullable: true })
  remark: string;
}
