import { Module } from '@nestjs/common';
import { EditDayPowerPurchaseService } from './edit-day-power-purchase.service';
import { EditDayPowerPurchaseResolver } from './edit-day-power-purchase.resolver';
// ** Require

import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';
import {
  EditDayPowerPurchase,
  EditDayPowerPurchaseSchema,
} from './entities/edit-day-power-purchase.entity';

@Module({
  imports: [
    UserModule,
    CustomerModule,
    MongooseModule.forFeatureAsync([
      {
        name: EditDayPowerPurchase.name,
        useFactory: () => {
          const schema = EditDayPowerPurchaseSchema;
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [EditDayPowerPurchaseResolver, EditDayPowerPurchaseService],
  exports: [EditDayPowerPurchaseService],
})
export class EditDayPowerPurchaseModule {}
