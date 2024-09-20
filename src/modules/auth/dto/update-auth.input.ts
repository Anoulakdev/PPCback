import { LoginInput } from './login.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAuthInput extends PartialType(LoginInput) {
  @Field(() => Int)
  id: number;
}
