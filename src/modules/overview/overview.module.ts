import { Module } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { OverviewResolver } from './overview.resolver';
import { UserModule } from '../user/user.module';
import { DayPowerPurchaseModule } from '../day-power-purchase/day-power-purchase.module';
import { WeekPowerPurchaseModule } from '../week-power-purchase/week-power-purchase.module';
import { MonthPowerPurchaseModule } from '../month-power-purchase/month-power-purchase.module';

@Module({
  imports: [
    UserModule,
    DayPowerPurchaseModule,
    WeekPowerPurchaseModule,
    MonthPowerPurchaseModule,
  ],
  providers: [OverviewResolver, OverviewService],
})
export class OverviewModule {}
