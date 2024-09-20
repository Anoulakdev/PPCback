import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { DistrictService } from './district.service';
import { District } from './entities/district.entity';
import { CreateDistrictInput } from './dto/create-district.input';
import { UpdateDistrictInput } from './dto/update-district.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Resolver(() => District)
@UseGuards(JwtAuthGuard)
export class DistrictResolver {
  constructor(private readonly districtService: DistrictService) {}

  @Mutation(() => District)
  createDistrict(
    @Args('createDistrictInput') createDistrictInput: CreateDistrictInput,
    @CurrentUser() user: User,
  ) {
    return this.districtService.create(user, createDistrictInput);
  }

  @Query(() => [District], { name: 'districts', nullable: 'items' })
  findAll(
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.districtService.findAll(queryInput);
  }

  @Query(() => District, { name: 'district', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.districtService.findOne(id);
  }

  @Mutation(() => District)
  updateDistrict(
    @Args('updateDistrictInput') updateDistrictInput: UpdateDistrictInput,
    @CurrentUser() user: User,
  ) {
    return this.districtService.update(user, updateDistrictInput);
  }

  @Mutation(() => District)
  removeDistrict(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.districtService.remove(user, id);
  }
}
