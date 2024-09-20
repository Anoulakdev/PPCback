import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CountryService } from './country.service';
import { Country } from './entities/country.entity';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Resolver(() => Country)
@UseGuards(JwtAuthGuard)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Mutation(() => Country)
  createCountry(
    @Args('createCountryInput') createCountryInput: CreateCountryInput,
    @CurrentUser() user: User,
  ) {
    return this.countryService.create(user, createCountryInput);
  }

  @Query(() => [Country], { name: 'countrys', nullable: 'items' })
  findAll(
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.countryService.findAll(queryInput);
  }

  @Query(() => Country, { name: 'country', nullable: true })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.countryService.findOne(id);
  }

  @Mutation(() => Country)
  updateCountry(
    @Args('updateCountryInput') updateCountryInput: UpdateCountryInput,
    @CurrentUser() user: User,
  ) {
    return this.countryService.update(user, updateCountryInput);
  }

  @Mutation(() => Country)
  removeCountry(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.countryService.remove(user, id);
  }
}
