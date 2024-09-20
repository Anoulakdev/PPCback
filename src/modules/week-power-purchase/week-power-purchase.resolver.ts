import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WeekPowerPurchaseService } from './week-power-purchase.service';
import { WeekPowerPurchase } from './entities/week-power-purchase.entity';
import { CreateWeekPowerPurchaseInput } from './dto/create-week-power-purchase.input';
import { UpdateWeekPowerPurchaseInput } from './dto/update-week-power-purchase.input';

// ** Require
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';
import { SummaryEnergy } from '../day-power-purchase/entities/summary-energy.entity';

@Resolver(() => WeekPowerPurchase)
@UseGuards(JwtAuthGuard)
export class WeekPowerPurchaseResolver {
  constructor(
    private readonly weekPowerPurchaseService: WeekPowerPurchaseService,
  ) {}

  @Mutation(() => WeekPowerPurchase)
  createWeekPowerPurchase(
    @CurrentUser() user: User,
    @Args('createWeekPowerPurchaseInput')
    createWeekPowerPurchaseInput: CreateWeekPowerPurchaseInput,
  ) {
    return this.weekPowerPurchaseService.create(
      user,
      createWeekPowerPurchaseInput,
    );
  }

  @Query(() => [WeekPowerPurchase], {
    name: 'weekDeclarations',
    nullable: 'items',
  })
  findAllDec(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.weekPowerPurchaseService.findAllDec(user, queryInput);
  }
  @Query(() => [WeekPowerPurchase], {
    name: 'allWeeklyDocument',
    nullable: 'items',
  })
  findAllDocument(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.weekPowerPurchaseService.findAllDocument(user, queryInput);
  }

  @Query(() => [WeekPowerPurchase], {
    name: 'weekDispatchs',
    nullable: 'items',
  })
  findAllDis(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.weekPowerPurchaseService.findAllDis(user, queryInput);
  }

  @Query(() => WeekPowerPurchase, { name: 'weekPowerPurchase' })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.weekPowerPurchaseService.findOne(user, id);
  }

  @Mutation(() => WeekPowerPurchase)
  updateWeekPowerPurchase(
    @CurrentUser() user: User,
    @Args('updateWeekPowerPurchaseInput')
    updateWeekPowerPurchaseInput: UpdateWeekPowerPurchaseInput,
  ) {
    return this.weekPowerPurchaseService.acknowledgedWeekDispatch(
      user,
      updateWeekPowerPurchaseInput,
    );
  }
  @Mutation(() => WeekPowerPurchase)
  acknowledgedWeekDeclaration(
    @CurrentUser() user: User,
    @Args('acknowledgedWeekDeclaration')
    acknowledgedWeekDeclaration: UpdateWeekPowerPurchaseInput,
  ) {
    return this.weekPowerPurchaseService.acknowledgedWeekDeclaration(
      user,
      acknowledgedWeekDeclaration,
    );
  }
  @Mutation(() => WeekPowerPurchase)
  acknowledgedWeekDispatch(
    @CurrentUser() user: User,
    @Args('acknowledgedWeekDispatch')
    acknowledgedWeekDispatch: UpdateWeekPowerPurchaseInput,
  ) {
    return this.weekPowerPurchaseService.acknowledgedWeekDispatch(
      user,
      acknowledgedWeekDispatch,
    );
  }

  @Mutation(() => WeekPowerPurchase)
  removeWeekPowerPurchase(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.weekPowerPurchaseService.remove(user, id);
  }

  // Query energy
  @Query(() => SummaryEnergy, {
    name: 'weekSummaryEnergy',
    nullable: true,
  })
  summaryEnergy(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.weekPowerPurchaseService.summaryEnergy(user, queryInput);
  }
}
