import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProvinceService } from './province.service';
import { Province } from './entities/province.entity';
import { CreateProvinceInput } from './dto/create-province.input';
import { UpdateProvinceInput } from './dto/update-province.input';
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Resolver(() => Province)
@UseGuards(JwtAuthGuard)
export class ProvinceResolver {
  constructor(private readonly provinceService: ProvinceService) {}

  @Mutation(() => Province)
  createProvince(
    @Args('createProvinceInput') createProvinceInput: CreateProvinceInput,
    @CurrentUser() user: User,
  ) {
    return this.provinceService.create(user, createProvinceInput);
  }

  @Query(() => [Province], { name: 'provinces', nullable: 'items' })
  findAll(
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.provinceService.findAll(queryInput);
  }

  @Query(() => Province, { name: 'province', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.provinceService.findOne(id);
  }

  @Mutation(() => Province)
  updateProvince(
    @Args('updateProvinceInput') updateProvinceInput: UpdateProvinceInput,
    @CurrentUser() user: User,
  ) {
    return this.provinceService.update(user, updateProvinceInput);
  }

  @Mutation(() => Province)
  removeProvince(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.provinceService.remove(user, id);
  }
}
