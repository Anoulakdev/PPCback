import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { VillageService } from './village.service';
import { Village } from './entities/village.entity';
import { CreateVillageInput } from './dto/create-village.input';
import { UpdateVillageInput } from './dto/update-village.input';
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { QueryInput } from 'src/utils/query-input';

@Resolver(() => Village)
@UseGuards(JwtAuthGuard)
export class VillageResolver {
  constructor(private readonly villageService: VillageService) {}

  @Mutation(() => Village)
  createVillage(
    @Args('createVillageInput') createVillageInput: CreateVillageInput,
  ) {
    return this.villageService.create(createVillageInput);
  }

  @Query(() => [Village], { name: 'villages', nullable: 'items' })
  findAll(
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.villageService.findAll(queryInput);
  }

  @Query(() => Village, { name: 'village', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.villageService.findOne(id);
  }

  @Mutation(() => Village)
  updateVillage(
    @Args('updateVillageInput') updateVillageInput: UpdateVillageInput,
  ) {
    return this.villageService.update(updateVillageInput);
  }

  @Mutation(() => Village)
  removeVillage(@Args('id', { type: () => String }) id: string) {
    return this.villageService.remove(id);
  }
}
