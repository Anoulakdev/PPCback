import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { District } from 'src/modules/district/entities/district.entity';

@ObjectType()
@Schema({
  collection: 'village',
  timestamps: true,
})
export class Village {
  @Field(() => ID)
  _id: string;
  @Field(() => Date)
  createdAt: Date;
  @Field(() => Date)
  updatedAt: Date;
  @Prop({ required: true, default: true })
  isActive: boolean;

  @Field(() => String, { nullable: true })
  @Prop()
  villageCode: string;

  @Field(() => District)
  @Prop({ type: SchemaTypes.ObjectId, ref: 'District', required: true })
  districtId: District;

  @Field(() => String)
  @Prop({ required: true })
  laName: string;

  @Field(() => String)
  @Prop({ required: true })
  enName: string;
}
export const VillageSchema = SchemaFactory.createForClass(Village);
