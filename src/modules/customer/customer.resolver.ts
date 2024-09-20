import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

// ** Require
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Resolver(() => Customer)
@UseGuards(JwtAuthGuard)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Mutation(() => Customer)
  createCustomer(
    @CurrentUser() user: User,
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
  ) {
    return this.customerService.create(user, createCustomerInput);
  }

  @Query(() => [Customer], { name: 'customers', nullable: 'items' })
  findAll(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.customerService.findAll(user, queryInput);
  }

  @Query(() => [Customer], { name: 'customerSelections', nullable: 'items' })
  findSelect(@CurrentUser() user: User) {
    return this.customerService.findSelect(user);
  }

  @Query(() => [Customer], { name: 'getPowerSources', nullable: 'items' })
  getPowerSource(@CurrentUser() user: User) {
    return this.customerService.getPowerSource(user);
  }

  @Query(() => Customer, { name: 'customer' })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.customerService.findOne(user, id);
  }

  @Mutation(() => [Customer], { name: 'searchCustomer', nullable: 'items' })
  searchCustomer(@Args('keyword') keyword: string, @CurrentUser() user: User) {
    return this.customerService.searchCustomer(user, keyword);
  }

  @Mutation(() => Customer)
  updateCustomer(
    @CurrentUser() user: User,
    @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
  ) {
    return this.customerService.update(user, updateCustomerInput);
  }

  @Mutation(() => Customer)
  removeCustomer(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.customerService.remove(user, id);
  }
}
