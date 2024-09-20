import { CreateOverviewInput } from './create-overview.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOverviewInput extends PartialType(CreateOverviewInput) {
  @Field(() => Int)
  id: number;
}
