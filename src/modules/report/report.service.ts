// ** Require
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { FilterQuery, Model } from 'mongoose';
import { checkId } from 'src/shares/checkId';
import { getQueryString } from 'src/utils/query';
import { QueryInput } from 'src/utils/query-input';
import { CustomerType, EditDataType, Message } from 'src/types';

import { CreateReportInput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';
import { DailyReport } from './entities/report.entity';
import { CustomerService } from '../customer/customer.service';
import { GetYesterDay } from 'src/shares/dateTime';

const populate = {
  path: 'decUserId decCustomerId disUserId disCustomerId',
};
@Injectable()
export class ReportService {
  constructor(
    @InjectModel(DailyReport.name)
    private dailyReport: Model<DailyReport>,
    private readonly customerService: CustomerService,
  ) {}
  async create(user: User, createReportInput: CreateReportInput) {
    if (user.customerId.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);

    const declaration = await this.customerService.findById(
      createReportInput.customerId,
    );
    if (!declaration) return new BadRequestException(Message.notFound);
    const dispatch = await this.customerService.findOneDetail(
      CustomerType.dispatch,
    );
    if (!dispatch) return new BadRequestException(Message.notFound);
    const totalPower = createReportInput.powers.reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
    const totalUnit = dispatch.unit;
    const powerNo = `${declaration.abbreviation || 'NO'}-${
      dispatch.abbreviation || 'NO'
    }`;
    let newData = new this.dailyReport({
      ...createReportInput,
      decUserId: user._id,
      decCustomerId: createReportInput.customerId,
      customerId: dispatch._id,
      disCustomerId: dispatch._id,
      totalUnit,
      totalPower,
      powerNo,
    });
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData.populate(populate);
  }

  async findAll(user: User, query: QueryInput) {
    let condition: FilterQuery<DailyReport>;
    if (user?.customerId?.type === CustomerType.dispatch) {
      condition = {
        decAcknowleged: true,
        disAcknowleged: true,
        isActive: true,
        disCustomerId: user.customerId._id,
      };
    }
    if (user?.customerId?.type === CustomerType.declaration) {
      const decCustomerId = user.customers.length
        ? user.customers.map((i) => i._id)
        : [];
      condition = {
        decAcknowleged: true,
        disAcknowleged: true,
        isActive: true,
        decCustomerId: { $in: decCustomerId },
      };
    }
    const queryString = getQueryString(query);
    const data = await this.dailyReport
      .find(
        {
          ...queryString?.conditions,
          ...condition,
        },
        null,
        {
          ...queryString?.options,
        },
      )
      .sort({ createdAt: -1 })
      .populate(populate);
    if (!data) return new BadRequestException(Message.getDataFail);
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  async getReportYesterDay(user: User, customerId: string) {
    if (!user._id) return new BadRequestException(Message.noPermissoin);
    const customer = await this.customerService.findById(customerId);

    const report: DailyReport = await this.dailyReport.findOne({
      createdAt: {
        $gte: new Date(GetYesterDay() + 'T00:00:00.000Z'),
        $lt: new Date(GetYesterDay() + 'T23:59:59.000Z'),
      },
      decCustomerId: customerId,
    });
    // console.log('Report====>', report);

    return { customer, asYesterday: report.activeStorage.amount };
  }

  update(id: number, updateReportInput: UpdateReportInput) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
