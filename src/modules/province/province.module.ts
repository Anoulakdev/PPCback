import { Module } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { ProvinceResolver } from './province.resolver';
import { Connection } from 'mongoose';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Province } from './entities/province.entity';
import { ProvinceSchema } from './entities/province.entity';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Province.name,
        useFactory: (connection: Connection) => {
          const schema = ProvinceSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'provinceId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [ProvinceResolver, ProvinceService],
})
export class ProvinceModule {}
