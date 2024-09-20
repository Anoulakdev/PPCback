import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Resolver(() => Role)
@UseGuards(JwtAuthGuard)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role)
  createRole(
    @CurrentUser() user: User,
    @Args('createRoleInput') createRoleInput: CreateRoleInput,
  ) {
    return this.roleService.create(user, createRoleInput);
  }

  @Query(() => [Role], { name: 'roles', nullable: 'items' })
  findAll(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.roleService.findAll(user, queryInput);
  }

  @Query(() => Role, { name: 'role' })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.roleService.findOne(user, id);
  }

  @Mutation(() => Role)
  updateRole(
    @CurrentUser() user: User,
    @Args('updateRoleInput') updateRoleInput: UpdateRoleInput,
  ) {
    return this.roleService.update(user, updateRoleInput);
  }

  @Mutation(() => Role)
  removeRole(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.roleService.remove(user, id);
  }
}
