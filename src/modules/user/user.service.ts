// ** Require
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { Model, Types } from 'mongoose';
import { checkId } from 'src/shares/checkId';
import { getQueryString } from 'src/utils/query';
import { CustomerType, Message, saltOrRounds } from 'src/types';
import { QueryInput } from 'src/utils/query-input';

// ** Import Module
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

const populate = {
  path: 'customerId roleId customers',
  match: { isActive: true },
};
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async create(user: User, createUserInput: CreateUserInput) {
    // console.log('createUserInput====>', createUserInput);

    if (createUserInput.password !== createUserInput.conFirmPassword)
      return new BadRequestException('Password not match');
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const password = await bcrypt.hash(
      createUserInput.password,
      saltOrRounds.saltOrRound,
    );
    const customers = createUserInput.customers.length
      ? createUserInput.customers.map((i) => new Types.ObjectId(i))
      : [];
    let newData = new this.userModel({
      ...createUserInput,
      customers,
      customerId: new Types.ObjectId(createUserInput.customerId),
      roleId: new Types.ObjectId(createUserInput.roleId),
      password,
    });
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData.populate(populate);
  }

  async findAll(user: User, query: QueryInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const queryString = getQueryString(query);

    const data = await this.userModel
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
    // console.log(data);

    return data;
  }

  async findOne(user: User, id: string) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    const condition = { _id: id, isActive: true };
    return await this.userModel.findOne(condition);
  }
  // User Detail
  async userDetail(id: string): Promise<User | null> {
    const condition: {
      _id: string;
      isActive: boolean;
    } = { _id: id, isActive: true };
    if (!checkId(id)) return null;
    return await this.userModel.findOne(condition).populate(populate);
  }

  async update(user: User, updateUserInput: UpdateUserInput) {
    // console.log('updateUserInput===>', updateUserInput);

    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const condition = { _id: updateUserInput.id, isActive: true };
    if (!checkId(updateUserInput.id))
      return new BadRequestException(Message.idInvalid);

    const updateData = await this.userModel
      .findOneAndUpdate(condition, updateUserInput, { new: true })
      .populate(populate);
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async remove(user: User, id: string) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const condition = { _id: id, isActive: true };
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    const updateData = await this.userModel
      .findOneAndUpdate(condition, { isActive: false }, { new: true })
      .populate(populate);
    if (!updateData) return new BadRequestException(Message.deleteFail);
    return updateData;
  }
}
