import { Module } from '@nestjs/common';
import { EditWeekPowerPurchaseService } from './edit-week-power-purchase.service';
import { EditWeekPowerPurchaseResolver } from './edit-week-power-purchase.resolver';
// ** Require

import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';
import {
  EditWeekPowerPurchase,
  EditWeekPowerPurchaseSchema,
} from './entities/edit-week-power-purchase.entity';

@Module({
  imports: [
    UserModule,
    CustomerModule,
    MongooseModule.forFeatureAsync([
      {
        name: EditWeekPowerPurchase.name,
        useFactory: () => {
          const schema = EditWeekPowerPurchaseSchema;
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [EditWeekPowerPurchaseResolver, EditWeekPowerPurchaseService],
  exports: [EditWeekPowerPurchaseService],
})
export class EditWeekPowerPurchaseModule {}
