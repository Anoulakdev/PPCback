import { Module } from '@nestjs/common';
import { DeclarationService } from './declaration.service';
import { DeclarationResolver } from './declaration.resolver';
// ** Require
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { Declaration, DeclarationSchema } from './entities/declaration.entity';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Declaration.name,
        useFactory: (connection: Connection) => {
          const schema = DeclarationSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'decId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [DeclarationResolver, DeclarationService],
})
export class DeclarationModule {}
