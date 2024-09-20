import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { InjectModel } from '@nestjs/mongoose';
import { Status } from './entities/status.entity';
import { Model } from 'mongoose';
import { CustomerType, Message, UserType } from 'src/types';
import { checkId } from 'src/shares/checkId';
import { QueryInput } from 'src/utils/query-input';
import { getQueryString } from 'src/utils/query';
import { User } from '../user/entities/user.entity';

@Injectable()
export class StatusService {
  constructor(@InjectModel(Status.name) private statusModel: Model<Status>) {}
  async create(user: User, createStatusInput: CreateStatusInput) {
    const status = await this.statusModel
      .findOne({ isActive: true })
      .sort({ statusNumber: -1 });
    const statusNumber = status ? status.statusNumber + 1 : 1;
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    let newData = new this.statusModel({ ...createStatusInput, statusNumber });
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData;
  }

  async findAll(user: User, query: QueryInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const queryString = getQueryString(query);
    const data = await this.statusModel.find(
      {
        ...queryString?.conditions,
      },
      null,
      {
        ...queryString?.options,
      },
    );
    if (!data) return new BadRequestException(Message.getDataFail);
    return data;
  }

  async findOne(id: string) {
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    return await this.statusModel.findOne({ _id: id, isActive: true });
  }

  async update(user: User, updateStatusInput: UpdateStatusInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(updateStatusInput.id))
      return new BadRequestException(Message.idInvalid);
    const condition = { _id: updateStatusInput.id, isActive: true };
    const updateData = await this.statusModel.findOneAndUpdate(
      condition,
      updateStatusInput,
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async remove(user: User, id: string) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    const condition = { _id: id, isActive: true };
    const updateData = await this.statusModel.findOneAndUpdate(
      condition,
      { isActive: false },
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async findByNumber(statusNumber: number) {
    return await this.statusModel.findOne({ statusNumber, isActive: true });
  }
}
