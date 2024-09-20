import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
class RoleData {
  @Field(() => String)
  @Prop()
  path: string;
  @Field(() => [String])
  @Prop({ required: true, enum: ['R', 'W', 'C', 'D'] })
  permission: string[];
}

@ObjectType()
@Schema({
  collection: 'role',
  timestamps: true,
})
export class Role {
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
  roleId: number;

  @Field(() => [String])
  @Prop({ required: true })
  paths: string[];

  @Field(() => [String], { nullable: 'items' })
  @Prop({ required: true })
  permissions: string[];

  @Field(() => String)
  @Prop({ required: true })
  name: string;
}
export const RoleSchema = SchemaFactory.createForClass(Role);
