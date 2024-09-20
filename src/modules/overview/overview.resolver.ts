import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OverviewService } from './overview.service';
import { Overview } from './entities/overview.entity';
// ** Require
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';
import { Chart } from './entities/chart.entity';

@Resolver(() => Overview)
@UseGuards(JwtAuthGuard)
export class OverviewResolver {
  constructor(private readonly overviewService: OverviewService) {}

  @Query(() => Chart, { name: 'chart' })
  chart(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.overviewService.chart(user, queryInput);
  }
}
