import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVillageInput } from './dto/create-village.input';
import { UpdateVillageInput } from './dto/update-village.input';
import { Village } from './entities/village.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'src/types';
import { QueryInput } from 'src/utils/query-input';
import { getQueryString } from 'src/utils/query';
import { checkId } from 'src/shares/checkId';
const populate = {
  path: 'districtId',
  populate: {
    path: 'provinceId',
    populate: {
      path: 'countryId',
    },
  },
};
@Injectable()
export class VillageService {
  constructor(
    @InjectModel(Village.name) private villageModel: Model<Village>,
  ) {}
  async create(createVillageInput: CreateVillageInput) {
    let newData = new this.villageModel(createVillageInput);
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData.populate(populate);
  }
  async findAll(query: QueryInput) {
    const queryString = getQueryString(query);
    const data = await this.villageModel
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
    return await this.villageModel
      .findOne({ _id: id, isActive: true })
      .populate(populate);
  }

  async update(updateVillageInput: UpdateVillageInput) {
    if (!checkId(updateVillageInput.id))
      return new BadRequestException(Message.idInvalid);
    const condition = { _id: updateVillageInput.id, isActive: true };
    const updateData = await this.villageModel
      .findOneAndUpdate(condition, updateVillageInput, { new: true })
      .populate(populate);
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async remove(id: string) {
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    const condition = { _id: id, isActive: true };
    const updateData = await this.villageModel
      .findOneAndUpdate(condition, { isActive: false }, { new: true })
      .populate(populate);
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }
}
