import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCountryInput {
  @Field(() => String)
  countryCode: string;

  @Field(() => String)
  phoneCode: string;

  @Field(() => String)
  laName: string;

  @Field(() => String)
  enName: string;
}
