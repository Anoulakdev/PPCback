import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryResolver } from './country.resolver';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Country, CountrySchema } from './entities/country.entity';
import { Connection } from 'mongoose';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Country.name,
        useFactory: (connection: Connection) => {
          const schema = CountrySchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'countryId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [CountryResolver, CountryService],
})
export class CountryModule {}
