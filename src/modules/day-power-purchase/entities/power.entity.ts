import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { EditDayPowerPurchase } from 'src/modules/edit-day-power-purchase/entities/edit-day-power-purchase.entity';
import { User } from 'src/modules/user/entities/user.entity';
@ObjectType()
export class PowerDetailData {
  @Field(() => [String])
  @Prop()
  powers: string[];
  @Field(() => String)
  @Prop({ required: true })
  title: string;
}
@ObjectType()
export class OriginalDetail {
  @Field(() => Number)
  @Prop()
  totalPower: number;

  @Field(() => Number)
  @Prop()
  totalUnit: number;

  @Field(() => [String], { nullable: 'items' })
  @Prop({ default: [] })
  remarks: string[];

  @Field(() => [String])
  @Prop()
  powers: string[];

  @Field(() => [PowerDetailData])
  @Prop({ required: true })
  details: PowerDetailData[];
}
@ObjectType()
export class EditData {
  @Field(() => User, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId?: User;

  @Field(() => Customer, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name })
  customerId?: Customer;

  @Field(() => EditDayPowerPurchase, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: EditDayPowerPurchase.name })
  dayEditId?: EditDayPowerPurchase;

  @Field(() => Date, { nullable: true })
  @Prop({ default: Date.now() })
  updateTime: Date;
}
@ObjectType()
export class AcknowlegeData {
  @Field(() => User, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId?: User;

  @Field(() => Customer, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name })
  customerId: Customer;

  @Field(() => Date, { nullable: true })
  @Prop({ default: Date.now() })
  updateTime: Date;
}
// ===>
@ObjectType()
export class Storage {
  @Field(() => Float)
  @Prop()
  amount: number;

  @Field(() => Float)
  @Prop()
  average: number;
}
@ObjectType()
export class ReservoirSituationData {
  @Field(() => Float)
  @Prop()
  upstreamLevel: number;

  @Field(() => Float)
  @Prop()
  downstreamLevel: number;

  @Field(() => Storage)
  @Prop({ type: Storage })
  totalStorage: Storage;

  @Field(() => Storage)
  @Prop({ type: Storage })
  activeStorage: Storage;
}

@ObjectType()
export class MachinesAvailabilityData {
  @Field(() => [Float])
  @Prop()
  maxs: number[];

  @Field(() => [Float])
  @Prop()
  mins: number[];
}

@ObjectType()
class DescriptionWaterDischargeData {
  @Field(() => Float)
  @Prop()
  amount: number;

  @Field(() => Float)
  @Prop()
  average: number;
}

@ObjectType()
export class WaterDischargeData {
  @Field(() => DescriptionWaterDischargeData)
  @Prop()
  turbineDischarge: DescriptionWaterDischargeData;
  @Field(() => DescriptionWaterDischargeData)
  @Prop()
  spillwayDischarge: DescriptionWaterDischargeData;
  @Field(() => DescriptionWaterDischargeData)
  @Prop()
  ecologicalDischarge: DescriptionWaterDischargeData;
}
