import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  OriginalDetail,
  PowerDetailData,
} from './../../day-power-purchase/entities/power.entity';

@ObjectType()
class ActiveStorage {
  @Field(() => Float)
  @Prop()
  amount: number;

  @Field(() => Float)
  @Prop()
  average: number;
}
@ObjectType()
class Inflow {
  @Field(() => Float)
  @Prop()
  amount: number;

  @Field(() => Float)
  @Prop()
  volume: number;
}
@ObjectType()
class OutFlow {
  @Field(() => Float)
  @Prop()
  amount: number;

  @Field(() => Float)
  @Prop()
  volume: number;
}
@ObjectType()
class SpillWay {
  @Field(() => Float)
  @Prop()
  amount: number;

  @Field(() => Float)
  @Prop()
  volume: number;
}
@ObjectType()
class OtherWaterReleased {
  @Field(() => Float)
  @Prop()
  amount: number;

  @Field(() => Float)
  @Prop()
  volume: number;
}

@ObjectType()
@Schema({
  collection: 'daily_report',
  timestamps: true,
})
export class DailyReport {
  @Field(() => ID)
  _id: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Prop({ required: true, default: true })
  isActive: boolean;

  @Field(() => Int)
  @Prop()
  reportId: number;

  @Field(() => String)
  @Prop()
  powerNo: string;

  @Field(() => Number)
  @Prop()
  totalPower: number;

  @Field(() => Number)
  @Prop()
  totalUnit: number;

  @Field(() => String, { nullable: true })
  @Prop()
  remark: string;

  @Field(() => User)
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  decUserId?: User;

  @Field(() => Customer)
  @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name, required: true })
  decCustomerId: Customer;

  @Field(() => User, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, default: null })
  disUserId: User;

  @Field(() => Customer)
  @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name, required: true })
  disCustomerId: Customer;

  @Field(() => [PowerDetailData])
  @Prop()
  powerDetail: PowerDetailData[];

  // @Field(() => OriginalDetail)
  // @Prop()
  // originalDetail: OriginalDetail;

  @Field(() => [String])
  @Prop()
  powers: string[];

  @Field(() => [String])
  @Prop()
  remarks: string[];

  @Field(() => Boolean)
  @Prop({ default: false })
  edited: boolean;

  @Field(() => Float)
  @Prop()
  waterLevel: number;

  @Field(() => Float)
  @Prop()
  dwy: number; //Diff With Yesterday

  @Field(() => Float)
  @Prop()
  dwf: number; //Diff With Full

  @Field(() => Float)
  @Prop()
  pws: number; //Potential Water Storage

  @Field(() => Float)
  @Prop()
  rainFall: number;

  @Field(() => Float)
  @Prop()
  netEnergyOutput: number; //Net Energy Output

  @Field(() => Float)
  @Prop()
  waterRate: number;

  @Field(() => ActiveStorage)
  @Prop({ type: ActiveStorage })
  activeStorage: ActiveStorage;

  @Field(() => Inflow)
  @Prop({ type: Inflow })
  inflow: Inflow;

  @Field(() => OutFlow)
  @Prop({ type: OutFlow })
  outFlow: OutFlow;

  @Field(() => SpillWay)
  @Prop({ type: SpillWay })
  spillWay: SpillWay;

  @Field(() => OtherWaterReleased)
  @Prop({ type: OtherWaterReleased })
  otherWaterReleased: OtherWaterReleased;
}
export const DailyReportSchema = SchemaFactory.createForClass(DailyReport);
