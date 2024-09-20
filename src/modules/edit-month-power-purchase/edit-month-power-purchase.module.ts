import { Module } from '@nestjs/common';
import { EditMonthPowerPurchaseService } from './edit-month-power-purchase.service';
import { EditMonthPowerPurchaseResolver } from './edit-month-power-purchase.resolver';
// ** Require

import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';

import {
  EditMonthPowerPurchase,
  EditMonthPowerPurchaseSchema,
} from './entities/edit-month-power-purchase.entity';

@Module({
  imports: [
    UserModule,
    CustomerModule,
    MongooseModule.forFeatureAsync([
      {
        name: EditMonthPowerPurchase.name,
        useFactory: () => {
          const schema = EditMonthPowerPurchaseSchema;
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [EditMonthPowerPurchaseResolver, EditMonthPowerPurchaseService],
  exports: [EditMonthPowerPurchaseService],
})
export class EditMonthPowerPurchaseModule {}
