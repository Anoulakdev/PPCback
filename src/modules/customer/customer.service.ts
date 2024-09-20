// ** Require
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { Model } from 'mongoose';
import { checkId } from 'src/shares/checkId';
import { getQueryString } from 'src/utils/query';
import { QueryInput } from 'src/utils/query-input';
import { CustomerType, Message } from 'src/types';

// ** Import Module
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}
  async create(user: User, createCustomerInput: CreateCustomerInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    let newData = new this.customerModel(createCustomerInput);
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData;
  }

  async findAll(user: User, query: QueryInput) {
    if (user?.customerId?.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const queryString = getQueryString(query);
    const data = await this.customerModel
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
  async getPowerSource(user: User) {
    if (!user._id) return new BadRequestException(Message.noPermissoin);

    if (user?.customerId?.type === CustomerType.dispatch) {
      const data = await this.customerModel.find({
        isActive: true,
      });
      if (!data) return new BadRequestException(Message.getDataFail);
      return data;
    }
    const data = await this.customerModel.find({
      _id: { $in: user.customers },
      isActive: true,
    });
    if (!data) return new BadRequestException(Message.getDataFail);
    return data;
  }

  async findSelect(user: User) {
    if (user?.customerId?.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const data = await this.customerModel
      .find({
        isActive: true,
        type: { $ne: CustomerType.dispatch },
      })
      .sort({ createdAt: -1 });
    if (!data) return new BadRequestException(Message.getDataFail);
    return data;
  }

  async searchCustomer(user: User, keyword: string) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const condition = {
      isActive: true,
      $or: [
        {
          phone: {
            $regex: '.*' + keyword + '.*',
            $options: 'i',
          },
        },
        {
          name: {
            $regex: '.*' + keyword + '.*',
            $options: 'i',
          },
        },
        {
          company: {
            $regex: '.*' + keyword + '.*',
            $options: 'i',
          },
        },
      ],
    };

    const data = await this.customerModel.find(condition);
    if (!data) return new BadRequestException(Message.getDataFail);
    return data;
  }

  async findOne(user: User, id: string) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    return await this.customerModel.findOne({ _id: id, isActive: true });
  }

  async findOneDetail(type: CustomerType): Promise<Customer | null> {
    return await this.customerModel.findOne({ type, isActive: true });
  }
  async findById(id: string): Promise<Customer | null> {
    return await this.customerModel.findById(id);
  }

  async update(user: User, updateCustomerInput: UpdateCustomerInput) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(updateCustomerInput.id))
      return new BadRequestException(Message.idInvalid);
    const condition = { _id: updateCustomerInput.id, isActive: true };
    const updateData = await this.customerModel.findOneAndUpdate(
      condition,
      updateCustomerInput,
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async remove(user: User, id: string) {
    if (user.customerId.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    const condition = {
      _id: id,
      isActive: true,
    };
    const updateData = await this.customerModel.findOneAndUpdate(
      condition,
      { isActive: false },
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.deleteFail);
    return updateData;
  }
}
