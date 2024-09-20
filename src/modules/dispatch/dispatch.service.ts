// ** Require
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { Model } from 'mongoose';
import { checkId } from 'src/shares/checkId';
import { getQueryString } from 'src/utils/query';
import { QueryInput } from 'src/utils/query-input';
import { CustomerType, Message, TimeType } from 'src/types';

import { CreateDispatchInput } from './dto/create-dispatch.input';
import { UpdateDispatchInput } from './dto/update-dispatch.input';
import { Dispatch } from './entities/dispatch.entity';

@Injectable()
export class DispatchService {
  constructor(
    @InjectModel(Dispatch.name) private dispatchModel: Model<Dispatch>,
  ) {}
  async create(user: User, createDispatchInput: CreateDispatchInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    let newData = new this.dispatchModel({
      ...createDispatchInput,
      userId: user._id,
      customerId: user.customerId._id,
    });
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData;
  }

  async findAll(user: User, query: QueryInput) {
    if (user?.customerId?.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const queryString = getQueryString(query);
    const data = await this.dispatchModel
      .find(
        {
          ...queryString?.conditions,
        },
        null,
        {
          ...queryString?.options,
        },
      )
      .sort({ createdAt: -1 });
    if (!data) return new BadRequestException(Message.getDataFail);
    return data;
  }

  async findOne(user: User, id: string) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    return await this.dispatchModel.findOne({ _id: id, isActive: true });
  }

  async update(user: User, updateDispatchInput: UpdateDispatchInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(updateDispatchInput.id))
      return new BadRequestException(Message.idInvalid);
    const condition = { _id: updateDispatchInput.id, isActive: true };
    const updateData = await this.dispatchModel.findOneAndUpdate(
      condition,
      updateDispatchInput,
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async remove(user: User, id: string) {
    if (user.customerId.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    const condition = {
      _id: id,
      isActive: true,
    };
    const updateData = await this.dispatchModel.findOneAndUpdate(
      condition,
      { isActive: false },
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.deleteFail);
    return updateData;
  }
}
