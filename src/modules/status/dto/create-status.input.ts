import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateStatusInput {
  @Field(() => String)
  laName: string;

  @Field(() => String)
  enName: string;
}
