import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { TimeType } from 'src/types';

@ObjectType()
export class UnitData {
  @Field(() => String)
  @Prop({ required: true })
  time: string;
  @Field(() => String)
  @Prop({ required: true })
  unitName: string;
  @Field(() => [String])
  @Prop()
  powers: string[];
}
@ObjectType()
export class UpdateData {
  @Field(() => User, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  userId?: User;

  @Field(() => Customer)
  @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name })
  customerId: Customer;

  @Field(() => String)
  @Prop()
  updateId: string;
}
@ObjectType()
@Schema({
  collection: 'declaration',
  timestamps: true,
})
export class Declaration {
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
  decId: number;

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
export const DeclarationSchema = SchemaFactory.createForClass(Declaration);
