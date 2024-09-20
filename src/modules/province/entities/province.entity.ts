import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Country } from 'src/modules/country/entities/country.entity';

@ObjectType()
@Schema({
  collection: 'province',
  timestamps: true,
})
export class Province {
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
  provinceId: number;

  @Field(() => String, { nullable: true })
  @Prop()
  abbLetters: string; //Abbreviated letters

  @Field(() => String)
  @Prop({ required: true })
  provinceCode: string;

  @Field(() => Country, { nullable: true })
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'Country' })
  countryId: Country;

  @Field(() => String)
  @Prop({ required: true })
  laName: string;

  @Field(() => String)
  @Prop({ required: true })
  enName: string;
}
export const ProvinceSchema = SchemaFactory.createForClass(Province);
