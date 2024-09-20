import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProvinceInput {
  @Field(() => String)
  provinceCode: string;

  @Field(() => String)
  countryId: string;

  @Field(() => String, { nullable: true })
  abbLetters: number; //Abbreviated letters

  @Field(() => String)
  laName: string;

  @Field(() => String)
  enName: string;
}
