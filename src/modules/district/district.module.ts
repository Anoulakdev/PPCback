import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictResolver } from './district.resolver';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { District, DistrictSchema } from './entities/district.entity';
import { Connection } from 'mongoose';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: District.name,
        useFactory: (connection: Connection) => {
          const schema = DistrictSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'districId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [DistrictResolver, DistrictService],
})
export class DistrictModule {}
