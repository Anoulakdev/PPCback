import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  user: string;
  @Field(() => String)
  password: string;
}
