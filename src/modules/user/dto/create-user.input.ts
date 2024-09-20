import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  customerId: string;

  @Field(() => [String])
  customers: string[];

  @Field(() => String)
  fName: string;

  @Field(() => String)
  lName: string;

  @Field(() => String)
  roleId: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  conFirmPassword: string;

  @Field(() => String)
  phone: string;
}
