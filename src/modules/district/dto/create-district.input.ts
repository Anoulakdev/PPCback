import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDistrictInput {
  @Field(() => String, { nullable: true })
  districtCode: string;

  @Field(() => String)
  provinceId: string;

  @Field(() => String)
  laName: string;

  @Field(() => String)
  enName: string;
}
