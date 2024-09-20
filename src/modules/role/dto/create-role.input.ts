import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRoleInput {
  @Field(() => [String])
  permissions: string[];

  @Field(() => [String])
  paths: string[];

  @Field(() => String)
  name: string;
}
