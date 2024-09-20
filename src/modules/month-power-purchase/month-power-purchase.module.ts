import { Module } from '@nestjs/common';
import { MonthPowerPurchaseService } from './month-power-purchase.service';
import { MonthPowerPurchaseResolver } from './month-power-purchase.resolver';
// ** Require
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';
import {
  MonthPowerPurchase,
  MonthPowerPurchaseSchema,
} from './entities/month-power-purchase.entity';
import { EditMonthPowerPurchaseModule } from '../edit-month-power-purchase/edit-month-power-purchase.module';

@Module({
  imports: [
    UserModule,
    CustomerModule,
    EditMonthPowerPurchaseModule,
    MongooseModule.forFeatureAsync([
      {
        name: MonthPowerPurchase.name,
        useFactory: (connection: Connection) => {
          const schema = MonthPowerPurchaseSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'monthId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [MonthPowerPurchaseResolver, MonthPowerPurchaseService],
  exports: [MonthPowerPurchaseService],
})
export class MonthPowerPurchaseModule {}
