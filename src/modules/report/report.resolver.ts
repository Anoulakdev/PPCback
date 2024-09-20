import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { DailyReport } from './entities/report.entity';
import { CreateReportInput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';

// ** Require
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/shares/user.decorator';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';
import { ResYesterday } from './type';

@Resolver(() => DailyReport)
@UseGuards(JwtAuthGuard)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @Mutation(() => DailyReport)
  createReport(
    @CurrentUser() user: User,
    @Args('createReportInput') createReportInput: CreateReportInput,
  ) {
    return this.reportService.create(user, createReportInput);
  }

  @Query(() => [DailyReport], { name: 'reports', nullable: 'items' })
  findAll(
    @CurrentUser() user: User,
    @Args('queryInput', { type: () => QueryInput, nullable: true })
    queryInput?: QueryInput,
  ) {
    return this.reportService.findAll(user, queryInput);
  }

  @Query(() => DailyReport, { name: 'report' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.reportService.findOne(id);
  }

  @Query(() => ResYesterday, { name: 'getReportYesterDay', nullable: true })
  getReportYesterDay(
    @CurrentUser() user: User,
    @Args('customerId', { type: () => String }) customerId: string,
  ) {
    return this.reportService.getReportYesterDay(user, customerId);
  }

  @Mutation(() => DailyReport)
  updateReport(
    @Args('updateReportInput') updateReportInput: UpdateReportInput,
  ) {
    return this.reportService.update(updateReportInput.id, updateReportInput);
  }

  @Mutation(() => DailyReport)
  removeReport(@Args('id', { type: () => Int }) id: number) {
    return this.reportService.remove(id);
  }
}
