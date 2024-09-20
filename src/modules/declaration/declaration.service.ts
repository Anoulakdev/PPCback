// ** Require
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { Model } from 'mongoose';
import { checkId } from 'src/shares/checkId';
import { getQueryString } from 'src/utils/query';
import { QueryInput } from 'src/utils/query-input';
import { CustomerType, Message } from 'src/types';

import { CreateDeclarationInput } from './dto/create-declaration.input';
import { UpdateDeclarationInput } from './dto/update-declaration.input';
import { Declaration } from './entities/declaration.entity';

@Injectable()
export class DeclarationService {
  constructor(
    @InjectModel(Declaration.name) private declarationModel: Model<Declaration>,
  ) {}
  async create(user: User, createDeclarationInput: CreateDeclarationInput) {
    if (user.customerId.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    let newData = new this.declarationModel({
      ...createDeclarationInput,
      userId: user._id,
      customerId: user.customerId._id,
    });
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData;
  }

  async findAll(user: User, query: QueryInput) {
    if (user?.customerId?.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    const queryString = getQueryString(query);
    const data = await this.declarationModel
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
    if (user.customerId.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    return await this.declarationModel.findOne({ _id: id, isActive: true });
  }

  async update(user: User, updateDeclarationInput: UpdateDeclarationInput) {
    if (user.customerId.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(updateDeclarationInput.id))
      return new BadRequestException(Message.idInvalid);
    const condition = { _id: updateDeclarationInput.id, isActive: true };
    const updateData = await this.declarationModel.findOneAndUpdate(
      condition,
      updateDeclarationInput,
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
    const updateData = await this.declarationModel.findOneAndUpdate(
      condition,
      { isActive: false },
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.deleteFail);
    return updateData;
  }
}
