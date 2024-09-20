// ** Require
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { FilterQuery, Model } from 'mongoose';
import { checkId } from 'src/shares/checkId';
import { getQueryString } from 'src/utils/query';
import { QueryInput } from 'src/utils/query-input';
import { CustomerType, EditDataType, Message } from 'src/types';

import { CreateWeekPowerPurchaseInput } from './dto/create-week-power-purchase.input';
import { UpdateWeekPowerPurchaseInput } from './dto/update-week-power-purchase.input';
import { WeekPowerPurchase } from './entities/week-power-purchase.entity';
import { CustomerService } from '../customer/customer.service';
import { EditWeekPowerPurchaseService } from '../edit-week-power-purchase/edit-week-power-purchase.service';

const populate = {
  path: 'decUserId decCustomerId disUserId disCustomerId',
};
@Injectable()
export class WeekPowerPurchaseService {
  constructor(
    @InjectModel(WeekPowerPurchase.name)
    private weekPowerPurchaseModel: Model<WeekPowerPurchase>,
    private readonly customerService: CustomerService,
    private readonly editWeekService: EditWeekPowerPurchaseService,
  ) {}

  async create(
    user: User,
    createWeekPowerPurchaseInput: CreateWeekPowerPurchaseInput,
  ) {
    // console.log(createWeekPowerPurchaseInput);

    if (user.customerId.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    const declaration = await this.customerService.findById(
      createWeekPowerPurchaseInput.customerId,
    );
    if (!declaration) return new BadRequestException(Message.notFound);
    const dispatch = await this.customerService.findOneDetail(
      CustomerType.dispatch,
    );
    if (!dispatch) return new BadRequestException(Message.notFound);
    const totalPower = createWeekPowerPurchaseInput.powers.reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
    const totalUnit = createWeekPowerPurchaseInput.powerDetail.length;
    const powerNo = `${user.customerId.abbreviation || 'NO'}-${
      dispatch.abbreviation || 'NO'
    }`;
    const originalDetail = {
      totalPower,
      totalUnit,
      powers: createWeekPowerPurchaseInput.powers,
      remarks: createWeekPowerPurchaseInput.remarks,
      details: createWeekPowerPurchaseInput.powerDetail,
    };
    let newData = new this.weekPowerPurchaseModel({
      ...createWeekPowerPurchaseInput,
      originalDetail,
      decUserId: user._id,
      decCustomerId: declaration._id,
      totalUnit,
      totalPower,
      disCustomerId: dispatch._id,
      powerNo,
    });
    newData = await newData.save();
    if (!newData) return new BadRequestException(Message.saveFail);
    return newData.populate(populate);
  }

  async findAllDec(user: User, query: QueryInput) {
    if (user?.customerId?.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    const condition = {
      isActive: true,
      decCustomerId: user.customerId._id,
    };
    const queryString = getQueryString(query);
    const data = await this.weekPowerPurchaseModel
      .find(
        {
          ...condition,
          ...queryString?.conditions,
        },
        null,
        {
          ...queryString?.options,
        },
      )
      .sort({ createdAt: -1 })
      .populate(populate);
    if (!data) return new BadRequestException(Message.getDataFail);
    return data;
  }

  async findAllDis(user: User, query: QueryInput) {
    if (user?.customerId?.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const condition = {
      isActive: true,
      disCustomerId: user.customerId._id,
    };
    const queryString = getQueryString(query);
    const data = await this.weekPowerPurchaseModel
      .find(
        {
          ...queryString?.conditions,
          ...condition,
        },
        null,
        {
          ...queryString?.options,
        },
      )
      .sort({ createdAt: -1 })
      .populate(populate);
    if (!data) return new BadRequestException(Message.getDataFail);
    return data;
  }

  async findOne(user: User, id: string) {
    // if (user.customerId.type !== CustomerType.declaration)
    //   return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    return await this.weekPowerPurchaseModel
      .findOne({
        _id: id,
        isActive: true,
        customerId: user.customerId._id,
      })
      .populate(populate);
  }

  async acknowledgedWeekDeclaration(
    user: User,
    updateWeekPowerPurchaseInput: UpdateWeekPowerPurchaseInput,
  ) {
    if (user?.customerId?.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const pp: WeekPowerPurchase = await this.weekPowerPurchaseModel.findById(
      updateWeekPowerPurchaseInput.id,
    );
    if (!pp) return new BadRequestException(Message.notFound);
    const totalPower = updateWeekPowerPurchaseInput.powers.reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
    const edits: EditDataType[] = pp.edits.length
      ? pp.edits.map((item) => {
          return {
            userId: String(item.userId),
            customerId: String(item.customerId),
            dayEditId: String(item.dayEditId),
            updateTime: String(item.updateTime),
          };
        })
      : [];
    let edited = pp.edited;
    let disAcknowleged = pp.disAcknowleged;
    if (totalPower !== pp.totalPower) {
      const saveEdit = await this.editWeekService.create(pp, user);
      if (!saveEdit) return new BadRequestException(Message.updateFail);
      const edit = {
        userId: user._id,
        customerId: user.customerId._id,
        dayEditId: saveEdit,
        updateTime: String(Date.now()),
      };
      edits.push(edit);
      edited = true;
      disAcknowleged = false;
    }
    const condition = {
      isActive: true,
      _id: updateWeekPowerPurchaseInput.id,
    };
    const disAcknowlegedDetail = {
      userId: user._id,
      customerId: user.customerId._id,
      updateTime: String(Date.now()),
    };
    const dataSet = {
      ...updateWeekPowerPurchaseInput,
      edited,
      edits,
      totalPower,
      disUserId: user._id,
      disAcknowlegedDetail: [disAcknowlegedDetail],
      decAcknowleged: true,
      disAcknowleged,
    };
    const updateData = await this.weekPowerPurchaseModel.findOneAndUpdate(
      condition,
      dataSet,
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }
  async acknowledgedWeekDispatch(
    user: User,
    updateWeekPowerPurchaseInput: UpdateWeekPowerPurchaseInput,
  ) {
    if (user?.customerId?.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    const pp: WeekPowerPurchase = await this.weekPowerPurchaseModel.findById(
      updateWeekPowerPurchaseInput.id,
    );
    if (!pp) return new BadRequestException(Message.notFound);
    const totalPower = updateWeekPowerPurchaseInput.powers.reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
    const edits: EditDataType[] = pp.edits.length
      ? pp.edits.map((item) => {
          return {
            userId: String(item.userId),
            customerId: String(item.customerId),
            dayEditId: String(item.dayEditId),
            updateTime: String(item.updateTime),
          };
        })
      : [];
    let edited = pp.edited;
    let decAcknowleged = pp.decAcknowleged;
    if (totalPower !== pp.totalPower) {
      const saveEdit = await this.editWeekService.create(pp, user);
      if (!saveEdit) return new BadRequestException(Message.updateFail);
      const edit = {
        userId: user._id,
        customerId: user.customerId._id,
        dayEditId: saveEdit,
        updateTime: String(Date.now()),
      };
      edits.push(edit);
      edited = true;
      decAcknowleged = false;
    }
    const condition = {
      isActive: true,
      _id: updateWeekPowerPurchaseInput.id,
    };
    const decAcknowlegedDetail = {
      userId: user._id,
      customerId: user.customerId._id,
      updateTime: String(Date.now()),
    };
    const dataSet = {
      ...updateWeekPowerPurchaseInput,
      edits,
      edited,
      totalPower,
      decAcknowlegedDetail: [decAcknowlegedDetail],
      disAcknowleged: true,
      decAcknowleged,
    };
    const updateData = await this.weekPowerPurchaseModel.findOneAndUpdate(
      condition,
      dataSet,
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async findAllDocument(
    user: User,
    query: QueryInput,
  ): Promise<WeekPowerPurchase[]> {
    // if (user?.customerId?.type !== CustomerType.declaration)
    //   return new BadRequestException(Message.noPermissoin);
    let condition: FilterQuery<WeekPowerPurchase>;

    if (user?.customerId?.type === CustomerType.dispatch) {
      condition = {
        isActive: true,
        disCustomerId: user.customerId._id,
        decAcknowleged: true,
        disAcknowleged: true,
      };
    }
    if (user?.customerId?.type === CustomerType.declaration) {
      const customers = user.customers.length
        ? user.customers.map((i) => i._id)
        : [];
      condition = {
        decAcknowleged: true,
        disAcknowleged: true,
        isActive: true,
        decCustomerId: { $in: customers },
      };
    }
    const queryString = getQueryString(query);
    const data = await this.weekPowerPurchaseModel
      .find(
        {
          ...queryString?.conditions,
          ...condition,
        },
        null,
        {
          ...queryString?.options,
        },
      )
      .sort({ createdAt: -1 })
      .populate(populate);
    if (!data) return [];
    return data;
  }

  async remove(user: User, id: string) {
    if (user.customerId.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    const condition = {
      _id: id,
      isActive: true,
    };
    const updateData = await this.weekPowerPurchaseModel.findOneAndUpdate(
      condition,
      { isActive: false },
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.deleteFail);
    return updateData;
  }

  // Energy

  async summaryEnergy(user: User, query: QueryInput) {
    let condition: FilterQuery<WeekPowerPurchase>;
    if (user.customerId.type === CustomerType.declaration) {
      const decCustomerId = user.customers.length
        ? user.customers.map((i) => i._id)
        : [];
      condition = {
        isActive: true,
        decAcknowleged: true,
        disAcknowleged: true,
        decCustomerId: { $in: decCustomerId },
      };
    }
    const queryString = getQueryString(query);

    // console.log(queryString);

    const data = await this.weekPowerPurchaseModel
      .find(
        {
          ...queryString?.conditions,
          ...condition,
          isActive: true,
          decAcknowleged: true,
          disAcknowleged: true,
        },
        null,
        {
          ...queryString?.options,
        },
      )
      .sort({ createdAt: -1 })
      .populate(populate);
    if (!data) return new BadRequestException(Message.getDataFail);
    const dispatch = data.length
      ? data.reduce((accumulator, currentValue) => {
          if (currentValue?.decAcknowleged) {
            return accumulator + (currentValue?.totalPower || 0);
          }

          return accumulator;
        }, 0)
      : 0;
    const declaration = data.length
      ? data.reduce((accumulator, currentValue) => {
          if (currentValue?.decAcknowleged) {
            return accumulator + (currentValue?.originalDetail.totalPower || 0);
          }
          return accumulator;
        }, 0)
      : 0;
    return {
      declaration,
      dispatch,
    };
  }
}
