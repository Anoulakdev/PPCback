import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { Role } from 'src/modules/role/entities/role.entity';

@ObjectType()
@Schema({
  collection: 'user',
  timestamps: true,
})
export class User {
  @Field(() => ID)
  _id: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Prop({ required: true, default: true })
  isActive: boolean;

  @Field(() => Int, { nullable: true })
  @Prop()
  userId: number;

  @Field(() => Customer, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: Customer.name })
  customerId: Customer;

  @Field(() => [Customer], { nullable: 'items' })
  @Prop([{ type: SchemaTypes.ObjectId, ref: Customer.name, default: [] }])
  customers: Customer[];

  @Field(() => Role, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: Role.name })
  roleId: Role;

  @Field(() => String)
  @Prop({ required: true })
  fName: string;

  @Field(() => String)
  @Prop({ required: true })
  lName: string;

  @Field(() => String)
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field(() => String)
  @Prop({ required: true })
  phone: string;

  @Prop()
  resetPasswordToken: string;

  @Prop()
  resetTokenExp: string;

  @Prop({ required: true, default: false })
  block: boolean;

  @Prop({ required: true, default: false })
  isOnline: boolean;

  @Prop({ required: true, default: 1 })
  versionLogin: number;

  @Prop({ required: true, default: 1 })
  versionToken: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
