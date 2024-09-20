import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './entities/role.entity';
import { Model } from 'mongoose';
import { Condition, CustomerType, Message, UserType } from 'src/types';
import { checkId } from 'src/shares/checkId';
import { QueryInput } from 'src/utils/query-input';
import { getQueryString } from 'src/utils/query';
import { User } from '../user/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}
  async create(user: User, createRoleInput: CreateRoleInput) {
    if (user.customerId.type === CustomerType.dispatch) {
      let newData = new this.roleModel(createRoleInput);
      newData = await newData.save();
      if (!newData) return new BadRequestException(Message.saveFail);
      return newData;
    }
    return new BadRequestException(Message.noPermissoin);
  }

  async findAll(user: User, query: QueryInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const queryString = getQueryString(query);
    const data = await this.roleModel.find(
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

  async findOne(user: User, id: string) {
    const condition: Condition = {
      _id: id,
      isActive: true,
    };
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    return await this.roleModel.findOne(condition);
  }

  async update(user: User, updateRoleInput: UpdateRoleInput) {
    const condition: Condition = {
      _id: updateRoleInput.id,
      isActive: true,
    };
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(updateRoleInput.id))
      return new BadRequestException(Message.idInvalid);

    const updateData = await this.roleModel.findOneAndUpdate(
      condition,
      updateRoleInput,
      { new: true },
    );

    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async remove(user: User, id: string) {
    const condition: Condition = {
      _id: id,
      isActive: true,
    };
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);

    const updateData = await this.roleModel.findOneAndUpdate(
      condition,
      { isActive: false },
      { new: true },
    );

    if (!updateData) return new BadRequestException(Message.deleteFail);
    return updateData;
  }
}
