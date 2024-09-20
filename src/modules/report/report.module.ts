import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportResolver } from './report.resolver';
// ** Require
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';
import { DailyReport, DailyReportSchema } from './entities/report.entity';

@Module({
  imports: [
    UserModule,
    CustomerModule,
    MongooseModule.forFeatureAsync([
      {
        name: DailyReport.name,
        useFactory: (connection: Connection) => {
          const schema = DailyReportSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'reportId' });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  providers: [ReportResolver, ReportService],
})
export class ReportModule {}
