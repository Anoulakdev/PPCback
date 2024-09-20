import { CreateProvinceInput } from './create-province.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProvinceInput extends PartialType(CreateProvinceInput) {
  @Field(() => String)
  id: string;
}
