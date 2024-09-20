import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  fName: string;

  @Field(() => String)
  lName: string;

  @Field(() => String)
  roleId: string;

  @Field(() => String)
  customerId: string;

  @Field(() => [String])
  customers: string[];

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;
}
