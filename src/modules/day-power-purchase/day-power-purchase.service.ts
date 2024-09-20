// ** Require
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { FilterQuery, Model } from 'mongoose';
import { checkId } from 'src/shares/checkId';
import { getQueryString } from 'src/utils/query';
import { QueryInput } from 'src/utils/query-input';
import { CustomerType, EditDataType, Message } from 'src/types';

import { CreateDayPowerPurchaseInput } from './dto/create-day-power-purchase.input';
import { UpdateDayPowerPurchaseInput } from './dto/update-day-power-purchase.input';
import { DayPowerPurchase } from './entities/day-power-purchase.entity';
import { CustomerService } from '../customer/customer.service';
// import { EditDayPowerPurchase } from '../edit-day-power-purchase/entities/edit-day-power-purchase.entity';
import { EditDayPowerPurchaseService } from '../edit-day-power-purchase/edit-day-power-purchase.service';
import { EditData } from './entities/power.entity';
import { GetEndYear, GetStartYear } from 'src/shares/dateTime';
const populate = {
  path: 'decUserId decCustomerId disUserId disCustomerId',
};

@Injectable()
export class DayPowerPurchaseService {
  constructor(
    @InjectModel(DayPowerPurchase.name)
    private dayPowerPurchase: Model<DayPowerPurchase>,
    private editPowerPurchaseService: EditDayPowerPurchaseService,
    private readonly customerService: CustomerService,
  ) {}
  async create(
    user: User,
    createDayPowerPurchaseInput: CreateDayPowerPurchaseInput,
  ) {
    if (user.customerId.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    const declaration = await this.customerService.findById(
      createDayPowerPurchaseInput.customerId,
    );
    if (!declaration) return new BadRequestException(Message.notFound);

    const dispatch = await this.customerService.findOneDetail(
      CustomerType.dispatch,
    );
    if (!dispatch) return new BadRequestException(Message.notFound);
    const totalPower = createDayPowerPurchaseInput.powers.reduce((a, b) => {
      return Number(a) + Number(b);
    }, 0);
    const totalUnit = createDayPowerPurchaseInput.powerDetail.length;
    const powerNo = `${user.customerId.abbreviation || 'NO'}-${
      dispatch.abbreviation || 'NO'
    }`;

    const originalDetail = {
      totalPower,
      totalUnit,
      powers: createDayPowerPurchaseInput.powers,
      remarks: createDayPowerPurchaseInput.remarks,
      details: createDayPowerPurchaseInput.powerDetail,
    };
    let newData = new this.dayPowerPurchase({
      ...createDayPowerPurchaseInput,
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
    const decCustomerId = user.customers.length
      ? user.customers.map((i) => i._id)
      : [];
    const condition = {
      isActive: true,
      decCustomerId: { $in: decCustomerId },
    };
    const queryString = getQueryString(query);
    const data = await this.dayPowerPurchase
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
    const data = await this.dayPowerPurchase
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

  async findAllDocument(
    user: User,
    query: QueryInput,
  ): Promise<DayPowerPurchase[]> {
    let condition: FilterQuery<DayPowerPurchase>;
    // if (!customerType) {
    //   condition = {
    //     isActive: true,
    //     decAcknowleged: true,
    //     disAcknowleged: true,
    //     $or: [
    //       { disCustomerId: user.customerId._id },
    //       { decCustomerId: user.customerId._id },
    //     ],
    //   };
    // }
    // console.log(user);

    if (user?.customerId?.type === CustomerType.dispatch) {
      condition = {
        decAcknowleged: true,
        disAcknowleged: true,
        isActive: true,
        disCustomerId: user.customerId._id,
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
    const data = await this.dayPowerPurchase
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

  async report(user: User, query: QueryInput) {
    const condition = {
      decAcknowleged: true,
      disAcknowleged: true,
      isActive: true,
      // decCustomerId: user.customerId._id,
    };
    const queryString = getQueryString(query);
    const data: DayPowerPurchase[] = await this.dayPowerPurchase
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

    const results = data.map((item) => {
      const power = item.powerDetail.map((detail) => detail.powers);

      const valueData = Array.from(Array(24), (_d, dIndex) => {
        const p: string[] = [];
        power.map((d) => {
          p.push(d[dIndex]);
        });
        if (p.length) {
          return p.reduce((a, b) => {
            return Number(a) + Number(b);
          }, 0);
        }
        // return p;
      });
      const newObj = {
        _id: item._id,
        createdAt: item.createdAt,
        dayId: item.dayId,
        powerNo: item.powerNo,
        totalPower: item.totalPower,
        totalUnit: item.totalUnit,
        remark: item.remark,
        powers: valueData,
        remarks: item.remarks,
      };
      return newObj;
    });

    return results;
  }

  async findOne(user: User, id: string) {
    // if (user.customerId.type !== CustomerType.declaration)
    //   return new BadRequestException(Message.noPermissoin);
    if (!checkId(id)) return new BadRequestException(Message.idInvalid);
    return await this.dayPowerPurchase
      .findOne({
        _id: id,
        isActive: true,
        customerId: user.customerId._id,
      })
      .populate(populate);
  }

  async acknowledgedDayDeclaration(
    user: User,
    acknowledgedDayDeclarationInput: UpdateDayPowerPurchaseInput,
  ) {
    if (user?.customerId?.type !== CustomerType.dispatch)
      return new BadRequestException(Message.noPermissoin);
    const pp: DayPowerPurchase = await this.dayPowerPurchase.findById(
      acknowledgedDayDeclarationInput.id,
    );
    if (!pp) return new BadRequestException(Message.notFound);
    const totalPower = acknowledgedDayDeclarationInput.powers.reduce((a, b) => {
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
        customerId: pp.decCustomerId + '',
        dayEditId: saveEdit,
        updateTime: String(Date.now()),
      };
      edits.push(edit);
      edited = true;
      disAcknowleged = false;
    }
    const condition = {
      isActive: true,
      _id: acknowledgedDayDeclarationInput.id,
    };
    const disAcknowlegedDetail = {
      userId: user._id,
      customerId: pp.decCustomerId,
      updateTime: String(Date.now()),
    };
    const dataSet = {
      ...acknowledgedDayDeclarationInput,
      edited,
      edits,
      totalPower,
      disUserId: user._id,
      disAcknowlegedDetail: [disAcknowlegedDetail],
      decAcknowleged: true,
      disAcknowleged,
    };
    const updateData = await this.dayPowerPurchase.findOneAndUpdate(
      condition,
      dataSet,
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.updateFail);
    return updateData;
  }

  async acknowledgedDayDispatch(
    user: User,
    acknowledgedDayDispatchInput: UpdateDayPowerPurchaseInput,
  ) {
    if (user?.customerId?.type !== CustomerType.declaration)
      return new BadRequestException(Message.noPermissoin);
    const pp: DayPowerPurchase = await this.dayPowerPurchase.findById(
      acknowledgedDayDispatchInput.id,
    );
    if (!pp) return new BadRequestException(Message.notFound);
    const totalPower = acknowledgedDayDispatchInput.powers.reduce((a, b) => {
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
        customerId: String(pp.decCustomerId),
        dayEditId: saveEdit,
        updateTime: String(Date.now()),
      };
      edits.push(edit);
      edited = true;
      decAcknowleged = false;
    }
    const condition = {
      isActive: true,
      _id: acknowledgedDayDispatchInput.id,
    };
    const decAcknowlegedDetail = {
      userId: user._id,
      customerId: pp.decCustomerId + '',
      updateTime: String(Date.now()),
    };
    const dataSet = {
      ...acknowledgedDayDispatchInput,
      edits,
      edited,
      totalPower,
      decAcknowlegedDetail: [decAcknowlegedDetail],
      disAcknowleged: true,
      decAcknowleged,
    };
    const updateData = await this.dayPowerPurchase.findOneAndUpdate(
      condition,
      dataSet,
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
    const updateData = await this.dayPowerPurchase.findOneAndUpdate(
      condition,
      { isActive: false },
      { new: true },
    );
    if (!updateData) return new BadRequestException(Message.deleteFail);
    return updateData;
  }

  async dayData(
    user: User,
    query: QueryInput,
  ): Promise<DayPowerPurchase[] | []> {
    let condition: FilterQuery<DayPowerPurchase>;
    if (user.customerId.type === CustomerType.declaration) {
      condition = {
        isActive: true,
        decAcknowleged: true,
        disAcknowleged: true,
        decCustomerId: user.customerId._id,
      };
    }
    const queryString = getQueryString(query);
    const updateData = await this.dayPowerPurchase
      .find(
        {
          ...condition,
          ...queryString?.conditions,
          decAcknowleged: true,
          disAcknowleged: true,
        },
        null,
        {
          ...queryString?.options,
        },
      )
      .sort({ createdAt: -1 });
    if (!updateData) return [];
    return updateData;
  }

  // Energy

  async summaryEnergy(user: User, query: QueryInput) {
    let condition: FilterQuery<DayPowerPurchase>;
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

    const data = await this.dayPowerPurchase
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
