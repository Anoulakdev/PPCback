import { Module } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { DispatchResolver } from './dispatch.resolver';
// ** Require
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { Dispatch, DispatchSchema } from './entities/dispatch.entity';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Dispatch.name,
        useFactory: (connection: Connection) => {
          const schema = DispatchSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'disId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [DispatchResolver, DispatchService],
})
export class DispatchModule {}
