import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { PowerDetailData } from 'src/modules/day-power-purchase/entities/power.entity';
import { User } from 'src/modules/user/entities/user.entity';

@ObjectType()
@Schema({
  collection: 'edit_week_power_purchase',
  timestamps: true,
})
export class EditWeekPowerPurchase {
  @Field(() => ID)
  _id: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Prop({ required: true, default: true })
  isActive: boolean;

  @Field(() => Number)
  @Prop()
  totalPower: number;

  @Field(() => Number)
  @Prop()
  totalUnit: number;

  @Field(() => String, { nullable: true })
  @Prop()
  remark: string;

  @Field(() => String)
  @Prop()
  dayPP: string;

  @Field(() => User)
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  userId?: User;

  @Field(() => Customer)
  @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name, required: true })
  customerId: Customer;

  @Field(() => [PowerDetailData])
  @Prop()
  powerDetail: PowerDetailData[];

  @Field(() => [String])
  @Prop()
  powers: string[];

  @Field(() => [String])
  @Prop()
  remarks: string[];

  @Field(() => Float)
  @Prop({ required: true, default: 1000 })
  price: number;
}
export const EditWeekPowerPurchaseSchema = SchemaFactory.createForClass(
  EditWeekPowerPurchase,
);
