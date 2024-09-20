import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDistrictInput } from './dto/create-district.input';
import { UpdateDistrictInput } from './dto/update-district.input';
import { InjectModel } from '@nestjs/mongoose';
import { District } from './entities/district.entity';
import { Model } from 'mongoose';
import { CustomerType, Message, UserType } from 'src/types';
import { QueryInput } from 'src/utils/query-input';
import { getQueryString } from 'src/utils/query';
import { checkId } from 'src/shares/checkId';
import { User } from '../user/entities/user.entity';
const populate = {
  path: 'provinceId',
  populate: {
    path: 'countryId',
  },
};
@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District.name) private districtModel: Model<District>,
  ) {}
  async create(user: User, createDistrictInput: CreateDistrictInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    let newData = new this.districtModel(createDistrictInput);
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData.populate(populate);
  }

  async findAll(query: QueryInput) {
    const queryString = getQueryString(query);
    const data = await this.districtModel
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
    return await this.districtModel
      .findOne({ _id: id, isActive: true })
      .populate(populate);
  }

  async update(user: User, updateDistrictInput: UpdateDistrictInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(updateDistrictInput.id))
      return new BadRequestException(Message.idInvalid);
    const condition = { _id: updateDistrictInput.id, isActive: true };
    const updateData = await this.districtModel
      .findOneAndUpdate(condition, updateDistrictInput, { new: true })
      .populate(populate);
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async remove(user: User, id: string) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    const condition = { _id: id, isActive: true };
    const updateData = await this.districtModel
      .findOneAndUpdate(condition, { isActive: false }, { new: true })
      .populate(populate);
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }
}
