import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentResolver } from './document.resolver';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';
import { DayPowerPurchaseModule } from '../day-power-purchase/day-power-purchase.module';
import { WeekPowerPurchaseModule } from '../week-power-purchase/week-power-purchase.module';
import { MonthPowerPurchaseModule } from '../month-power-purchase/month-power-purchase.module';

@Module({
  imports: [
    UserModule,
    CustomerModule,
    DayPowerPurchaseModule,
    WeekPowerPurchaseModule,
    MonthPowerPurchaseModule,
  ],
  providers: [DocumentResolver, DocumentService],
})
export class DocumentModule {}
