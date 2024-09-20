import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({
  collection: 'country',
  timestamps: true,
})
export class Country {
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
  countryId: number;

  @Field(() => String)
  @Prop({ required: true })
  countryCode: string;

  @Field(() => String)
  @Prop({ required: true })
  phoneCode: string;

  @Field(() => String)
  @Prop({ required: true })
  laName: string;

  @Field(() => String)
  @Prop({ required: true })
  enName: string;
}
export const CountrySchema = SchemaFactory.createForClass(Country);
