import { CreateDispatchInput } from './create-dispatch.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDispatchInput extends PartialType(CreateDispatchInput) {
  @Field(() => String)
  id: string;
}
