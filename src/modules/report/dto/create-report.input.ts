import { InputType, Field, Float } from '@nestjs/graphql';
import { PowerDetailInput } from 'src/modules/day-power-purchase/dto/power.input';
@InputType()
class ActiveStorageInput {
  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  average: number;
}
@InputType()
class InflowInput {
  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  volume: number;
}
@InputType()
class OutFlowInput {
  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  volume: number;
}
@InputType()
class SpillWayInput {
  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  volume: number;
}
@InputType()
class OtherWaterReleasedInput {
  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  volume: number;
}

@InputType()
export class CreateReportInput {
  @Field(() => [PowerDetailInput])
  powerDetail: PowerDetailInput[];

  @Field(() => [String])
  powers: string[];

  @Field(() => [String])
  remarks: string[];

  @Field(() => String, { nullable: true })
  remark: string;

  @Field(() => String)
  customerId: string;

  @Field(() => Float)
  waterLevel: number;

  @Field(() => Float)
  dwy: number; //Diff With Yesterday

  @Field(() => Float)
  dwf: number; //Diff With Full

  @Field(() => Float)
  pws: number; //Potential Water Storage

  @Field(() => Float)
  rainFall: number;

  @Field(() => Float)
  netEnergyOutput: number; //Net Energy Output

  @Field(() => Float)
  waterRate: number;

  @Field(() => ActiveStorageInput)
  activeStorage: ActiveStorageInput;

  @Field(() => InflowInput)
  inflow: InflowInput;

  @Field(() => OutFlowInput)
  outFlow: OutFlowInput;

  @Field(() => SpillWayInput)
  spillWay: SpillWayInput;

  @Field(() => OtherWaterReleasedInput)
  otherWaterReleased: OtherWaterReleasedInput;
}
