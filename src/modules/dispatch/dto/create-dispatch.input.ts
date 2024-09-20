import { InputType, Int, Field } from '@nestjs/graphql';
import { UnitDataInput } from 'src/modules/declaration/dto/create-declaration.input';

@InputType()
export class CreateDispatchInput {
  @Field(() => String)
  name: string;

  @Field(() => [UnitDataInput])
  units: UnitDataInput[];

  @Field(() => [String])
  powers: string[];

  @Field(() => [String])
  remarks: string[];
}
