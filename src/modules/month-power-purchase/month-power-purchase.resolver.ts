import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MonthPowerPurchaseService } from './month-power-purchase.service';
import { MonthPowerPurchase } from './entities/month-power-purchase.entity';
import { CreateMonthPowerPurchaseInput } from './dto/create-month-power-purchase.input';
import { UpdateMonthPowerPurchaseInput } from './dto/update-month-power-purchase.input';

// ** Require
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';
import { SummaryEnergy } from '../day-power-purchase/entities/summary-energy.entity';

@Resolver(() => MonthPowerPurchase)
@UseGuards(JwtAuthGuard)
export class MonthPowerPurchaseResolver {
  constructor(
    private readonly monthPowerPurchaseService: MonthPowerPurchaseService,
  ) {}

  @Mutation(() => MonthPowerPurchase)
  createMonthPowerPurchase(
    @CurrentUser() user: User,
    @Args('createMonthPowerPurchaseInput')
    createMonthPowerPurchaseInput: CreateMonthPowerPurchaseInput,
  ) {
    return this.monthPowerPurchaseService.create(
      user,
      createMonthPowerPurchaseInput,
    );
  }

  @Query(() => [MonthPowerPurchase], {
    name: 'monthDeclarations',
    nullable: 'items',
  })
  findAllDec(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.monthPowerPurchaseService.findAllDec(user, queryInput);
  }

  @Query(() => [MonthPowerPurchase], {
    name: 'monthDispatchs',
    nullable: 'items',
  })
  findAllDis(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.monthPowerPurchaseService.findAllDis(user, queryInput);
  }

  @Query(() => MonthPowerPurchase, { name: 'monthPowerPurchase' })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.monthPowerPurchaseService.findOne(user, id);
  }

  @Mutation(() => MonthPowerPurchase)
  updateMonthPowerPurchase(
    @CurrentUser() user: User,
    @Args('updateMonthPowerPurchaseInput')
    updateMonthPowerPurchaseInput: UpdateMonthPowerPurchaseInput,
  ) {
    return this.monthPowerPurchaseService.acknowledgedMonthDispatch(
      user,
      updateMonthPowerPurchaseInput,
    );
  }
  @Mutation(() => MonthPowerPurchase)
  acknowledgedMonthDeclaration(
    @CurrentUser() user: User,
    @Args('acknowledgedMonthDeclaration')
    acknowledgedMonthDeclaration: UpdateMonthPowerPurchaseInput,
  ) {
    return this.monthPowerPurchaseService.acknowledgedMonthDeclaration(
      user,
      acknowledgedMonthDeclaration,
    );
  }
  @Mutation(() => MonthPowerPurchase)
  acknowledgedMonthDispatch(
    @CurrentUser() user: User,
    @Args('acknowledgedMonthDispatch')
    acknowledgedMonthDispatch: UpdateMonthPowerPurchaseInput,
  ) {
    return this.monthPowerPurchaseService.acknowledgedMonthDispatch(
      user,
      acknowledgedMonthDispatch,
    );
  }
  // @Query(() => [MonthPowerPurchase], {
  //   name: 'allMonthlyDocument',
  //   nullable: 'items',
  // })
  // findAllDocument(
  //   @CurrentUser() user: User,
  //   @Args('queryInput', { type: () => QueryInput, nullable: true })
  //   queryInput?: QueryInput,
  // ) {
  //   return this.monthPowerPurchaseService.findAllDocument(user, queryInput);
  // }

  @Mutation(() => MonthPowerPurchase)
  removeMonthPowerPurchase(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.monthPowerPurchaseService.remove(user, id);
  }

  // Query energy
  @Query(() => SummaryEnergy, {
    name: 'monthSummaryEnergy',
    nullable: true,
  })
  summaryEnergy(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.monthPowerPurchaseService.summaryEnergy(user, queryInput);
  }
}
