import { InputType, Field } from '@nestjs/graphql';
import {
  MachinesAvailabilityInput,
  PowerDetailInput,
  ReservoirSituationInput,
  WaterDischargeInput,
} from './power.input';
@InputType()
export class CreateDayPowerPurchaseInput {
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

  @Field(() => ReservoirSituationInput)
  reservoirSituation: ReservoirSituationInput;

  @Field(() => MachinesAvailabilityInput)
  machinesAvailability: MachinesAvailabilityInput;

  @Field(() => WaterDischargeInput)
  waterDischarge: WaterDischargeInput;
}
