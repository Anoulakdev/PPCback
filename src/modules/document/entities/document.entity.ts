import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Document {
  @Field(() => ID)
  _id: string;
  @Field(() => Date)
  createdAt: Date;

  @Field(() => String)
  powerNo: string;

  @Field(() => String)
  declaration: number;

  @Field(() => String)
  dispatch: number;

  @Field(() => String)
  dis_dec: string;

  @Field(() => Boolean)
  edited: boolean;

  @Field(() => Boolean)
  decAcknowleged: boolean;

  @Field(() => Boolean)
  disAcknowleged: boolean;
}
