import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StatusService } from './status.service';
import { Status } from './entities/status.entity';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Resolver(() => Status)
@UseGuards(JwtAuthGuard)
export class StatusResolver {
  constructor(private readonly statusService: StatusService) {}

  @Mutation(() => Status)
  createStatus(
    @CurrentUser() user: User,
    @Args('createStatusInput') createStatusInput: CreateStatusInput,
  ) {
    return this.statusService.create(user, createStatusInput);
  }

  @Query(() => [Status], { name: 'statuss', nullable: 'items' })
  findAll(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.statusService.findAll(user, queryInput);
  }

  @Query(() => Status, { name: 'status', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.statusService.findOne(id);
  }

  @Mutation(() => Status)
  updateStatus(
    @CurrentUser() user: User,
    @Args('updateStatusInput') updateStatusInput: UpdateStatusInput,
  ) {
    return this.statusService.update(user, updateStatusInput);
  }

  @Mutation(() => Status)
  removeStatus(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.statusService.remove(user, id);
  }
}
