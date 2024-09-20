import { Injectable } from '@nestjs/common';
import { UpdateEditMonthPowerPurchaseInput } from './dto/update-edit-month-power-purchase.input';
import { EditMonthPowerPurchase } from './entities/edit-month-power-purchase.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { MonthPowerPurchase } from '../month-power-purchase/entities/month-power-purchase.entity';

@Injectable()
export class EditMonthPowerPurchaseService {
  constructor(
    @InjectModel(EditMonthPowerPurchase.name)
    private editPowerPurchase: Model<EditMonthPowerPurchase>,
  ) {}
  async create(pp: MonthPowerPurchase, user: User) {
    const newData = new this.editPowerPurchase({
      totalPower: pp.totalPower,
      totalUnit: pp.totalUnit,
      remark: pp.remark,
      dayPP: pp._id,
      userId: user._id,
      customerId: user.customerId._id,
      powerDetail: pp.powerDetail,
      powers: pp.powers,
      remarks: pp.remarks,
      price: pp.price,
    });
    const saveEdit = await newData.save();
    if (!saveEdit) return false;
    return saveEdit._id;
  }

  findAll() {
    return `This action returns all editMonthPowerPurchase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} editMonthPowerPurchase`;
  }

  update(
    id: number,
    updateEditMonthPowerPurchaseInput: UpdateEditMonthPowerPurchaseInput,
  ) {
    return `This action updates a #${id} editMonthPowerPurchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} editMonthPowerPurchase`;
  }
}
