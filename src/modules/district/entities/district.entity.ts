import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Province } from 'src/modules/province/entities/province.entity';

@ObjectType()
@Schema({
  collection: 'district',
  timestamps: true,
})
export class District {
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
  districtId: number;

  @Field(() => String, { nullable: true })
  @Prop()
  districtCode: string;

  @Field(() => Province)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Province', required: true })
  provinceId: Province;

  @Field(() => String)
  @Prop({ required: true })
  laName: string;

  @Field(() => String)
  @Prop({ required: true })
  enName: string;
}
export const DistrictSchema = SchemaFactory.createForClass(District);
