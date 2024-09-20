import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVillageInput {
  @Field(() => String, { nullable: true })
  villageCode: string;

  @Field(() => String)
  districtId: string;

  @Field(() => String)
  laName: string;

  @Field(() => String)
  enName: string;
}
