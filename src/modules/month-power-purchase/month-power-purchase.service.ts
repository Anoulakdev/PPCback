// ** Require
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { FilterQuery, Model } from 'mongoose';
import { checkId } from 'src/shares/checkId';
import { getQueryString } from 'src/utils/query';
import { QueryInput } from 'src/utils/query-input';
import { CustomerType, EditDataType, Message } from 'src/types';
import { CreateMonthPowerPurchaseInput } from './dto/create-month-power-purchase.input';
import { UpdateMonthPowerPurchaseInput } from './dto/update-month-power-purchase.input';
import { MonthPowerPurchase } from './entities/month-power-purchase.entity';
import { CustomerService } from '../customer/customer.service';
import { EditMonthPowerPurchaseService } from '../edit-month-power-purchase/edit-month-power-purchase.service';
const populate = {
  path: 'decUserId decCustomerId disUserId disCustomerId',
};
@Injectable()
export class MonthPowerPurchaseService {
  constructor(
    @InjectModel(MonthPowerPurchase.name)
    private monthModel: Model<MonthPowerPurchase>,
    private readonly customerService: CustomerService,
    private editPowerPurchaseService: EditMonthPowerPurchaseService,
  ) {}
  async create(
    user: User,
    createMonthPowerPurchaseInput: CreateMonthPowerPurchaseInput,
  ) {
    // console.log(createMonthPowerPurchaseInput);

    if (user.customerId.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    const declaration = await this.customerService.findById(
      createMonthPowerPurchaseInput.customerId,
    );
    if (!declaration) return new BadRequestException(Message.notFound);
    const dispatch = await this.customerService.findOneDetail(
      CustomerType.dispatch,
    );
    if (!dispatch) return new BadRequestException(Message.notFound);
    const totalPower = createMonthPowerPurchaseInput.powers.reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
    const totalUnit = createMonthPowerPurchaseInput.powerDetail.length;
    const powerNo = `${user.customerId.abbreviation || 'NO'}-${
      dispatch.abbreviation || 'NO'
    }`;

    const originalDetail = {
      totalPower,
      totalUnit,
      powers: createMonthPowerPurchaseInput.powers,
      remarks: createMonthPowerPurchaseInput.remarks,
      details: createMonthPowerPurchaseInput.powerDetail,
    };
    let newData = new this.monthModel({
      ...createMonthPowerPurchaseInput,
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
    let condition: FilterQuery<MonthPowerPurchase>;
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
    const data = await this.monthModel
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
    const data = await this.monthModel
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

  async findOne(user: User, id: string) {
    // if (user.customerId.type !== CustomerType.declaration)
    //   return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    return await this.monthModel
      .findOne({
        _id: id,
        isActive: true,
        customerId: user.customerId._id,
      })
      .populate(populate);
  }

  async acknowledgedMonthDeclaration(
    user: User,
    updateMonthPowerPurchaseInput: UpdateMonthPowerPurchaseInput,
  ) {
    if (user?.customerId?.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const pp: MonthPowerPurchase = await this.monthModel.findById(
      updateMonthPowerPurchaseInput.id,
    );
    if (!pp) return new BadRequestException(Message.notFound);
    const totalPower = updateMonthPowerPurchaseInput.powers.reduce((a, b) => {
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
      const saveEdit = await this.editPowerPurchaseService.create(pp, user);
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
      _id: updateMonthPowerPurchaseInput.id,
    };
    const disAcknowlegedDetail = {
      userId: user._id,
      customerId: user.customerId._id,
      updateTime: String(Date.now()),
    };
    const dataSet = {
      ...updateMonthPowerPurchaseInput,
      edited,
      edits,
      totalPower,
      disUserId: user._id,
      disAcknowlegedDetail: [disAcknowlegedDetail],
      decAcknowleged: true,
      disAcknowleged,
    };
    const updateData = await this.monthModel.findOneAndUpdate(
      condition,
      dataSet,
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }
  async acknowledgedMonthDispatch(
    user: User,
    updateMonthPowerPurchaseInput: UpdateMonthPowerPurchaseInput,
  ) {
    if (user?.customerId?.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    const pp: MonthPowerPurchase = await this.monthModel.findById(
      updateMonthPowerPurchaseInput.id,
    );
    if (!pp) return new BadRequestException(Message.notFound);
    const totalPower = updateMonthPowerPurchaseInput.powers.reduce((a, b) => {
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
      const saveEdit = await this.editPowerPurchaseService.create(pp, user);
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
      _id: updateMonthPowerPurchaseInput.id,
    };
    const decAcknowlegedDetail = {
      userId: user._id,
      customerId: user.customerId._id,
      updateTime: String(Date.now()),
    };
    const dataSet = {
      ...updateMonthPowerPurchaseInput,
      edits,
      edited,
      totalPower,
      decAcknowlegedDetail: [decAcknowlegedDetail],
      disAcknowleged: true,
      decAcknowleged,
    };
    const updateData = await this.monthModel.findOneAndUpdate(
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
  ): Promise<MonthPowerPurchase[]> {
    // if (user?.customerId?.type !== CustomerType.declaration)
    //   return new BadRequestException(Message.noPermissoin);
    let condition: FilterQuery<MonthPowerPurchase>;

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
    const data = await this.monthModel
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
    const updateData = await this.monthModel.findOneAndUpdate(
      condition,
      { isActive: false },
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.deleteFail);
    return updateData;
  }

  // Energy

  async summaryEnergy(user: User, query: QueryInput) {
    let condition: FilterQuery<MonthPowerPurchase>;
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

    const data = await this.monthModel
      .find(
        {
          ...condition,
          ...queryString?.conditions,
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
