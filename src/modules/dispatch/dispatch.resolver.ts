import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DispatchService } from './dispatch.service';
import { Dispatch } from './entities/dispatch.entity';
import { CreateDispatchInput } from './dto/create-dispatch.input';
import { UpdateDispatchInput } from './dto/update-dispatch.input';

// ** Require
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Resolver(() => Dispatch)
@UseGuards(JwtAuthGuard)
export class DispatchResolver {
  constructor(private readonly dispatchService: DispatchService) {}

  @Mutation(() => Dispatch)
  createDispatch(
    @CurrentUser() user: User,
    @Args('createDispatchInput') createDispatchInput: CreateDispatchInput,
  ) {
    return this.dispatchService.create(user, createDispatchInput);
  }

  @Query(() => [Dispatch], { name: 'dispatchs', nullable: 'items' })
  findAll(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.dispatchService.findAll(user, queryInput);
  }

  @Query(() => Dispatch, { name: 'dispatch', nullable: true })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.dispatchService.findOne(user, id);
  }

  @Mutation(() => Dispatch)
  updateDispatch(
    @CurrentUser() user: User,
    @Args('updateDispatchInput') updateDispatchInput: UpdateDispatchInput,
  ) {
    return this.dispatchService.update(user, updateDispatchInput);
  }

  @Mutation(() => Dispatch)
  removeDispatch(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.dispatchService.remove(user, id);
  }
}
