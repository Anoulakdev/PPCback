import { Module } from '@nestjs/common';
import { VillageService } from './village.service';
import { VillageResolver } from './village.resolver';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Village, VillageSchema } from './entities/village.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeatureAsync([
      {
        name: Village.name,
        useFactory: () => {
          const schema = VillageSchema;
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [VillageResolver, VillageService],
})
export class VillageModule {}
