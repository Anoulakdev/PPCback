import { InputType, Field, Float } from '@nestjs/graphql';
@InputType()
export class PowerDetailInput {
  @Field(() => String)
  title: string;
  @Field(() => [String])
  powers: string[];
}

@InputType()
export class StorageInput {
  @Field(() => Float)
  amount: number;
  @Field(() => Float)
  average: number;
}
@InputType()
export class ReservoirSituationInput {
  @Field(() => Float)
  upstreamLevel: number;

  @Field(() => Float)
  downstreamLevel: number;

  @Field(() => StorageInput)
  totalStorage: StorageInput;

  @Field(() => StorageInput)
  activeStorage: StorageInput;
}

@InputType()
export class MachinesAvailabilityInput {
  @Field(() => [Float])
  maxs: number[];

  @Field(() => [Float])
  mins: number[];
}

@InputType()
export class DescriptionWaterDischargeInput {
  @Field(() => Float)
  amount: number;
  @Field(() => Float)
  average: number;
}

@InputType()
export class WaterDischargeInput {
  @Field(() => DescriptionWaterDischargeInput)
  turbineDischarge: DescriptionWaterDischargeInput;
  @Field(() => DescriptionWaterDischargeInput)
  spillwayDischarge: DescriptionWaterDischargeInput;
  @Field(() => DescriptionWaterDischargeInput)
  ecologicalDischarge: DescriptionWaterDischargeInput;
}
