import { Module, ValidationPipe } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { APP_PIPE } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { CountryModule } from './modules/country/country.module';
import { ProvinceModule } from './modules/province/province.module';
import { DistrictModule } from './modules/district/district.module';
import { VillageModule } from './modules/village/village.module';
import { AddressModule } from './modules/address/address.module';
import { StatusModule } from './modules/status/status.module';
import { DeclarationModule } from './modules/declaration/declaration.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { WeekPowerPurchaseModule } from './modules/week-power-purchase/week-power-purchase.module';
import { DayPowerPurchaseModule } from './modules/day-power-purchase/day-power-purchase.module';
import { MonthPowerPurchaseModule } from './modules/month-power-purchase/month-power-purchase.module';
import { EditDayPowerPurchaseModule } from './modules/edit-day-power-purchase/edit-day-power-purchase.module';
import { EditWeekPowerPurchaseModule } from './modules/edit-week-power-purchase/edit-week-power-purchase.module';
import { EditMonthPowerPurchaseModule } from './modules/edit-month-power-purchase/edit-month-power-purchase.module';
import { OverviewModule } from './modules/overview/overview.module';
import { DocumentModule } from './modules/document/document.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    RoleModule,
    AuthModule,
    CustomerModule,
    CountryModule,
    ProvinceModule,
    DistrictModule,
    VillageModule,
    AddressModule,
    StatusModule,
    DeclarationModule,
    DispatchModule,
    WeekPowerPurchaseModule,
    DayPowerPurchaseModule,
    MonthPowerPurchaseModule,
    EditDayPowerPurchaseModule,
    EditWeekPowerPurchaseModule,
    EditMonthPowerPurchaseModule,
    OverviewModule,
    DocumentModule,
    SubscriptionModule,
    ReportModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
