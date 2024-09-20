import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProvinceInput } from './dto/create-province.input';
import { UpdateProvinceInput } from './dto/update-province.input';
import { InjectModel } from '@nestjs/mongoose';
import { Province } from './entities/province.entity';
import { Model } from 'mongoose';
import { CustomerType, Message, UserType } from 'src/types';
import { QueryInput } from 'src/utils/query-input';
import { getQueryString } from 'src/utils/query';
import { checkId } from 'src/shares/checkId';
import { User } from '../user/entities/user.entity';
const populate = {
  path: 'countryId',
};
@Injectable()
export class ProvinceService {
  constructor(
    @InjectModel(Province.name) private provinceModel: Model<Province>,
  ) {}
  async create(user: User, createProvinceInput: CreateProvinceInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    let newData = new this.provinceModel(createProvinceInput);
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData.populate(populate);
  }

  async findAll(query: QueryInput) {
    const queryString = getQueryString(query);
    const data = await this.provinceModel
      .find(
        {
          ...queryString?.conditions,
        },
        null,
        {
          ...queryString?.options,
        },
      )
      .populate(populate);
    if (!data) return new BadRequestException(Message.getDataFail);
    return data;
  }

  async findOne(id: string) {
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    return await this.provinceModel
      .findOne({ _id: id, isActive: true })
      .populate(populate);
  }

  async update(user: User, updateProvinceInput: UpdateProvinceInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(updateProvinceInput.id))
      return new BadRequestException(Message.idInvalid);
    const condition = { _id: updateProvinceInput.id, isActive: true };
    const updateData = await this.provinceModel
      .findOneAndUpdate(condition, updateProvinceInput, { new: true })
      .populate(populate);
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async remove(user: User, id: string) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    const condition = { _id: id, isActive: true };
    const updateData = await this.provinceModel
      .findOneAndUpdate(condition, { isActive: true }, { new: true })
      .populate(populate);
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }
}
