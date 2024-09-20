import { Module } from '@nestjs/common';
import { WeekPowerPurchaseService } from './week-power-purchase.service';
import { WeekPowerPurchaseResolver } from './week-power-purchase.resolver';
// ** Require
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';
import {
  WeekPowerPurchase,
  WeekPowerPurchaseSchema,
} from './entities/week-power-purchase.entity';
import { EditWeekPowerPurchaseModule } from '../edit-week-power-purchase/edit-week-power-purchase.module';

@Module({
  imports: [
    UserModule,
    CustomerModule,
    EditWeekPowerPurchaseModule,
    MongooseModule.forFeatureAsync([
      {
        name: WeekPowerPurchase.name,
        useFactory: (connection: Connection) => {
          const schema = WeekPowerPurchaseSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'weekId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [WeekPowerPurchaseResolver, WeekPowerPurchaseService],
  exports: [WeekPowerPurchaseService],
})
export class WeekPowerPurchaseModule {}
