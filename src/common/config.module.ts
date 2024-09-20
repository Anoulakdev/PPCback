import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

const ENV = process.env.ENV;
@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
