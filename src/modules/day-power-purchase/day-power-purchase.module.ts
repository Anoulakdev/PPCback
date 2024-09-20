import { Module } from '@nestjs/common';
import { DayPowerPurchaseService } from './day-power-purchase.service';
import { DayPowerPurchaseResolver } from './day-power-purchase.resolver';
// ** Require
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';
import {
  DayPowerPurchase,
  DayPowerPurchaseSchema,
} from './entities/day-power-purchase.entity';
import { EditDayPowerPurchaseModule } from '../edit-day-power-purchase/edit-day-power-purchase.module';

@Module({
  imports: [
    UserModule,
    CustomerModule,
    EditDayPowerPurchaseModule,
    MongooseModule.forFeatureAsync([
      {
        name: DayPowerPurchase.name,
        useFactory: (connection: Connection) => {
          const schema = DayPowerPurchaseSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'dayId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [DayPowerPurchaseResolver, DayPowerPurchaseService],
  exports: [DayPowerPurchaseService],
})
export class DayPowerPurchaseModule {}
