import { Injectable } from '@nestjs/common';
import { CreateEditWeekPowerPurchaseInput } from './dto/create-edit-week-power-purchase.input';
import { UpdateEditWeekPowerPurchaseInput } from './dto/update-edit-week-power-purchase.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { WeekPowerPurchase } from '../week-power-purchase/entities/week-power-purchase.entity';
import { User } from '../user/entities/user.entity';
import { EditWeekPowerPurchase } from './entities/edit-week-power-purchase.entity';

@Injectable()
export class EditWeekPowerPurchaseService {
  constructor(
    @InjectModel(EditWeekPowerPurchase.name)
    private editPowerPurchase: Model<EditWeekPowerPurchase>,
  ) {}
  async create(pp: WeekPowerPurchase, user: User) {
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
    return `This action returns all editWeekPowerPurchase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} editWeekPowerPurchase`;
  }

  update(
    id: number,
    updateEditWeekPowerPurchaseInput: UpdateEditWeekPowerPurchaseInput,
  ) {
    return `This action updates a #${id} editWeekPowerPurchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} editWeekPowerPurchase`;
  }
}
