import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Schema } from '@nestjs/mongoose';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  AcknowlegeData,
  EditData,
  MachinesAvailabilityData,
  PowerDetailData,
  ReservoirSituationData,
  WaterDischargeData,
} from './power.entity';

@ObjectType()
@Schema({
  collection: 'day_power_purchase',
  timestamps: true,
})
export class DayReport {
  @Field(() => ID)
  _id: string;
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Int)
  dayId: number;

  @Field(() => String)
  powerNo: string;

  @Field(() => Number)
  totalPower: number;

  @Field(() => Number)
  totalUnit: number;

  @Field(() => String, { nullable: true })
  remark: string;

  @Field(() => [Int])
  powers: number[];

  @Field(() => [String])
  remarks: string[];
}
