import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import {
  UnitData,
  UpdateData,
} from 'src/modules/declaration/entities/declaration.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { TimeType } from 'src/types';

@ObjectType()
export class Dispatch {
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
  disId: number;

  @Field(() => User)
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId: User;

  @Field(() => Customer)
  @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name })
  customerId: Customer;

  @Field(() => Int)
  @Prop({
    required: true,
    enum: TimeType,
  })
  type: number;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => [UnitData])
  @Prop()
  units: UnitData[];

  @Field(() => [String])
  @Prop()
  powers: string[];

  @Field(() => [String])
  @Prop()
  remarks: string[];

  @Field(() => [UpdateData])
  @Prop({ default: [] })
  update: UpdateData[];
}

export const DispatchSchema = SchemaFactory.createForClass(Dispatch);
