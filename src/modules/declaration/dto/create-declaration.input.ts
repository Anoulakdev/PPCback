import { InputType, Int, Field } from '@nestjs/graphql';
@InputType()
export class UnitDataInput {
  @Field(() => String)
  time: string;
  @Field(() => String)
  unitName: string;
  @Field(() => [String])
  powers: string[];
}
@InputType()
export class CreateDeclarationInput {
  @Field(() => String)
  name: string;

  @Field(() => [UnitDataInput])
  units: UnitDataInput[];

  @Field(() => [String])
  powers: string[];

  @Field(() => [String])
  remarks: string[];
}
