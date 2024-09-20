import { Injectable } from '@nestjs/common';
import { UpdateEditDayPowerPurchaseInput } from './dto/update-edit-day-power-purchase.input';
import { InjectModel } from '@nestjs/mongoose';
import { EditDayPowerPurchase } from './entities/edit-day-power-purchase.entity';
import { Model } from 'mongoose';
import { DayPowerPurchase } from '../day-power-purchase/entities/day-power-purchase.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class EditDayPowerPurchaseService {
  constructor(
    @InjectModel(EditDayPowerPurchase.name)
    private editPowerPurchase: Model<EditDayPowerPurchase>,
  ) {}
  async create(pp: DayPowerPurchase, user: User) {
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
    return `This action returns all editDayPowerPurchase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} editDayPowerPurchase`;
  }

  update(
    id: number,
    updateEditDayPowerPurchaseInput: UpdateEditDayPowerPurchaseInput,
  ) {
    return `This action updates a #${id} editDayPowerPurchase`;
  }

  remove(id: number) {
    return `This action removes a #${id} editDayPowerPurchase`;
  }
}
