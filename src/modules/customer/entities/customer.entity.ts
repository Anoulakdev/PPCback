import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Village } from 'src/modules/village/entities/village.entity';
import { CustomerType } from 'src/types';

@ObjectType()
@Schema({
  collection: 'customer',
  timestamps: true,
})
export class Customer {
  @Field(() => ID)
  _id: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Prop({ required: true, default: true })
  isActive: boolean;
  @Field(() => Int)
  @Prop({
    required: true,
    enum: CustomerType,
    default: CustomerType.declaration,
  })
  type: number;

  @Field(() => Village, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Village' })
  villageId?: Village;

  @Field(() => String)
  @Prop({ required: true })
  name: string;

  @Field(() => String)
  @Prop({ required: true })
  company: string;

  @Field(() => String)
  @Prop({ required: true })
  abbreviation: string;

  @Field(() => String)
  @Prop()
  email: string;

  @Field(() => String, { nullable: true })
  @Prop()
  logo: string;

  @Field(() => Int)
  @Prop({ required: true, default: 1 })
  unit: number;

  @Field(() => String)
  @Prop({ required: true })
  address: string;

  @Field(() => String)
  @Prop({ required: true })
  phone: string;

  @Field(() => Float)
  @Prop({ required: true, default: 0 })
  floodLevel: number;

  @Field(() => Float)
  @Prop({ required: true, default: 0 })
  fullLevel: number;

  @Field(() => Float)
  @Prop({ required: true, default: 0 })
  minimumLevel: number;

  @Field(() => Float)
  @Prop({ required: true, default: 0 })
  deadLevel: number;

  @Field(() => Float)
  @Prop({ required: true, default: 0 })
  totalActiveStorage: number;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
