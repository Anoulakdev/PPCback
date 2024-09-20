import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({
  collection: 'status',
  timestamps: true,
})
export class Status {
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
  statusId: number;

  @Prop({ required: true })
  statusNumber: number;

  @Field(() => String)
  @Prop({ required: true })
  laName: string;

  @Field(() => String)
  @Prop({ required: true })
  enName: string;
}
export const StatusSchema = SchemaFactory.createForClass(Status);
