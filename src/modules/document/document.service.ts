// ** Require
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { FilterQuery, Model } from 'mongoose';
import { checkId } from 'src/shares/checkId';
import { getQueryString } from 'src/utils/query';
import { QueryInput } from 'src/utils/query-input';
import { CustomerType, DocumentType, EditDataType, Message } from 'src/types';

import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';
import { DayPowerPurchaseService } from '../day-power-purchase/day-power-purchase.service';
import { WeekPowerPurchaseService } from '../week-power-purchase/week-power-purchase.service';
import { MonthPowerPurchaseService } from '../month-power-purchase/month-power-purchase.service';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentService {
  constructor(
    private readonly dayService: DayPowerPurchaseService,
    private readonly weekService: WeekPowerPurchaseService,
    private readonly monthService: MonthPowerPurchaseService,
  ) {}

  create(createDocumentInput: CreateDocumentInput) {
    return 'This action adds a new document';
  }

  async findAll(user: User, query: QueryInput, docType: string) {
    const data: Document[] = [];
    if (docType === DocumentType.daily) {
      const dialyData = await this.dayService.findAllDocument(user, query);
      if (dialyData.length) {
        dialyData.map((item) => {
          data.push({
            _id: item._id,
            createdAt: item.createdAt,
            powerNo: `${item.powerNo}-${item.dayId}`,
            declaration: item.originalDetail.totalPower,
            dispatch: item.totalPower,
            dis_dec: item.powerNo,
            edited: item.edited,
            decAcknowleged: item.decAcknowleged,
            disAcknowleged: item.disAcknowleged,
          });
        });
      }
    } else if (docType === DocumentType.weekly) {
      const weeklyData = await this.weekService.findAllDocument(user, query);
      if (weeklyData.length) {
        weeklyData.map((item) => {
          data.push({
            _id: item._id,
            createdAt: item.createdAt,
            powerNo: `${item.powerNo}-${item.weekId}`,
            declaration: item.originalDetail.totalPower,
            dispatch: item.totalPower,
            dis_dec: item.powerNo,
            edited: item.edited,
            decAcknowleged: item.decAcknowleged,
            disAcknowleged: item.disAcknowleged,
          });
        });
      }
    } else if (docType === DocumentType.monthly) {
      const monthlyData = await this.monthService.findAllDocument(user, query);
      if (monthlyData.length) {
        monthlyData.map((item) => {
          data.push({
            _id: item._id,
            createdAt: item.createdAt,
            powerNo: `${item.powerNo}-${item.monthId}`,
            declaration: item.originalDetail.totalPower,
            dispatch: item.totalPower,
            dis_dec: item.powerNo,
            edited: item.edited,
            decAcknowleged: item.decAcknowleged,
            disAcknowleged: item.disAcknowleged,
          });
        });
      }
    } else {
      return data;
    }
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} document`;
  }

  update(id: number, updateDocumentInput: UpdateDocumentInput) {
    return `This action updates a #${id} document`;
  }

  remove(id: number) {
    return `This action removes a #${id} document`;
  }
}
