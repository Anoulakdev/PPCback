import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusResolver } from './status.resolver';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Status, StatusSchema } from './entities/status.entity';
import { Connection } from 'mongoose';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Status.name,
        useFactory: (connection: Connection) => {
          const schema = StatusSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'statusId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [StatusResolver, StatusService],
  exports: [StatusService],
})
export class StatusModule {}
