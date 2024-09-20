import { CreateVillageInput } from './create-village.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVillageInput extends PartialType(CreateVillageInput) {
  @Field(() => String)
  id: string;
}
