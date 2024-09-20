import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import {
  AcknowlegeData,
  EditData,
  OriginalDetail,
  PowerDetailData,
} from 'src/modules/day-power-purchase/entities/power.entity';

import { User } from 'src/modules/user/entities/user.entity';
@ObjectType()
@Schema({
  collection: 'month_power_purchase',
  timestamps: true,
})
export class MonthPowerPurchase {
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
  monthId: number;

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

  @Field(() => OriginalDetail)
  @Prop()
  originalDetail: OriginalDetail;

  @Field(() => [String])
  @Prop()
  powers: string[];

  @Field(() => [String])
  @Prop()
  remarks: string[];

  @Field(() => [EditData], { nullable: 'itemsAndList' })
  @Prop({ default: [] })
  edits: EditData[];

  @Field(() => Boolean)
  @Prop({ default: false })
  edited: boolean;

  @Field(() => [AcknowlegeData], { nullable: 'itemsAndList' })
  @Prop({ default: [] })
  decAcknowlegedDetail: AcknowlegeData[];

  @Field(() => Boolean)
  @Prop({ default: false })
  decAcknowleged: boolean;

  @Field(() => [AcknowlegeData], { nullable: 'itemsAndList' })
  @Prop({ default: [] })
  disAcknowlegedDetail: AcknowlegeData[];

  @Field(() => Boolean)
  @Prop({ default: false })
  disAcknowleged: boolean;

  @Field(() => Float)
  @Prop({ required: true, default: 1000 })
  price: number;
}
export const MonthPowerPurchaseSchema =
  SchemaFactory.createForClass(MonthPowerPurchase);
