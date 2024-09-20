import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { checkId } from 'src/shares/checkId';
import { CustomerType, Message } from 'src/types';
import { InjectModel } from '@nestjs/mongoose';
import { Country } from './entities/country.entity';
import { Model } from 'mongoose';
import { getQueryString } from 'src/utils/query';
import { QueryInput } from 'src/utils/query-input';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}
  async create(user: User, createCountryInput: CreateCountryInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    let newData = new this.countryModel(createCountryInput);
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData;
  }

  async findAll(query: QueryInput) {
    const queryString = getQueryString(query);
    const data = await this.countryModel.find(
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
    return await this.countryModel.findOne({ _id: id, isActive: true });
  }

  async update(user: User, updateCountryInput: UpdateCountryInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(updateCountryInput.id))
      return new BadRequestException(Message.idInvalid);
    const condition = { _id: updateCountryInput.id, isActive: true };
    const updateData = await this.countryModel.findOneAndUpdate(
      condition,
      updateCountryInput,
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
    const updateData = await this.countryModel.findOneAndUpdate(
      condition,
      { isActive: false },
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }
}
