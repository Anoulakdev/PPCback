import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DeclarationService } from './declaration.service';
import { Declaration } from './entities/declaration.entity';
import { CreateDeclarationInput } from './dto/create-declaration.input';
import { UpdateDeclarationInput } from './dto/update-declaration.input';

// ** Require
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Resolver(() => Declaration)
@UseGuards(JwtAuthGuard)
export class DeclarationResolver {
  constructor(private readonly declarationService: DeclarationService) {}

  @Mutation(() => Declaration)
  createDeclaration(
    @CurrentUser() user: User,
    @Args('createDeclarationInput')
    createDeclarationInput: CreateDeclarationInput,
  ) {
    return this.declarationService.create(user, createDeclarationInput);
  }

  @Query(() => [Declaration], { name: 'declarations', nullable: 'items' })
  findAll(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.declarationService.findAll(user, queryInput);
  }

  @Query(() => Declaration, { name: 'declaration', nullable: true })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.declarationService.findOne(user, id);
  }

  @Mutation(() => Declaration)
  updateDeclaration(
    @CurrentUser() user: User,
    @Args('updateDeclarationInput')
    updateDeclarationInput: UpdateDeclarationInput,
  ) {
    return this.declarationService.update(user, updateDeclarationInput);
  }

  @Mutation(() => Declaration)
  removeDeclaration(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.declarationService.remove(user, id);
  }
}
