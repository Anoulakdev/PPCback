import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DayPowerPurchaseService } from './day-power-purchase.service';
import { DayPowerPurchase } from './entities/day-power-purchase.entity';
import { CreateDayPowerPurchaseInput } from './dto/create-day-power-purchase.input';
import { UpdateDayPowerPurchaseInput } from './dto/update-day-power-purchase.input';

// ** Require
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';
import { DayReport } from './entities/report';
import { SummaryEnergy } from './entities/summary-energy.entity';

@Resolver(() => DayPowerPurchase)
@UseGuards(JwtAuthGuard)
export class DayPowerPurchaseResolver {
  constructor(
    private readonly dayPowerPurchaseService: DayPowerPurchaseService,
  ) {}

  @Mutation(() => DayPowerPurchase, { name: 'createDayDeclaration' })
  createDayPowerPurchase(
    @CurrentUser() user: User,
    @Args('createDayDeclarationInput')
    createDayDeclarationInput: CreateDayPowerPurchaseInput,
  ) {
    return this.dayPowerPurchaseService.create(user, createDayDeclarationInput);
  }

  @Query(() => [DayPowerPurchase], {
    name: 'dayDeclarations',
    nullable: 'items',
  })
  findAllDec(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.dayPowerPurchaseService.findAllDec(user, queryInput);
  }

  @Query(() => [DayPowerPurchase], {
    name: 'dayDispatchs',
    nullable: 'items',
  })
  findAllDis(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.dayPowerPurchaseService.findAllDis(user, queryInput);
  }
  @Query(() => [DayPowerPurchase], {
    name: 'allDocument',
    nullable: 'items',
  })

  // @Query(() => [DayReport], {
  @Query(() => [DayReport], {
    name: 'dayReport',
    nullable: 'items',
  })
  report(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.dayPowerPurchaseService.report(user, queryInput);
  }

  @Query(() => DayPowerPurchase, { name: 'dayPowerPurchase', nullable: true })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.dayPowerPurchaseService.findOne(user, id);
  }

  @Mutation(() => DayPowerPurchase, { name: 'acknowledgedDayDeclaration' })
  acknowledgedDayDeclaration(
    @CurrentUser() user: User,
    @Args('acknowledgedDayDeclarationInput')
    acknowledgedDayDeclarationInput: UpdateDayPowerPurchaseInput,
  ) {
    return this.dayPowerPurchaseService.acknowledgedDayDeclaration(
      user,
      acknowledgedDayDeclarationInput,
    );
  }

  @Mutation(() => DayPowerPurchase, { name: 'acknowledgedDayDispatch' })
  acknowledgedDayDispatch(
    @CurrentUser() user: User,
    @Args('acknowledgedDayDispatchInput')
    acknowledgedDayDispatchInput: UpdateDayPowerPurchaseInput,
  ) {
    return this.dayPowerPurchaseService.acknowledgedDayDispatch(
      user,
      acknowledgedDayDispatchInput,
    );
  }

  @Mutation(() => DayPowerPurchase)
  removeDayPowerPurchase(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.dayPowerPurchaseService.remove(user, id);
  }

  // Query energy
  @Query(() => SummaryEnergy, {
    name: 'summaryEnergy',
    nullable: true,
  })
  summaryEnergy(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.dayPowerPurchaseService.summaryEnergy(user, queryInput);
  }
}
