import { CreateDeclarationInput } from './create-declaration.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDeclarationInput extends PartialType(
  CreateDeclarationInput,
) {
  @Field(() => String)
  id: string;
}
