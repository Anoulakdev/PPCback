import { ObjectId } from 'mongoose';
export type Ref<T> = T | ObjectId;
export enum CustomerType {
  declaration = 1,
  dispatch = 2,
}
export enum DocumentType {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
}
export interface DateRange {
  startDate?: string;
  endDate?: string;
}
export enum UserType {
  superAdmin = 1,
  admin = 2,
  user = 3,
}
export interface EditDataType {
  userId: string;
  customerId: string;
  dayEditId: string;
  updateTime: string;
}
export enum TimeType {
  day = 1,
  week = 7,
  month = 30,
}
export interface Condition {
  _id: string;
  isActive: boolean;
}

export interface Conditions {
  field: string;
  value: string;
}

export const jwtConstants = {
  secret: 'secretKey',
};
export const saltOrRounds = {
  saltOrRound: 10,
};

export enum Message {
  saveFail = 'Save data failed, please try again!',
  saveSuccess = 'Save data successfully',
  updateSuccess = 'Update data successfully',
  updateFail = 'Update data failed, please try again!',
  deleteSuccess = 'Delete data successfully',
  deleteFail = 'Delete data failed, please try again!',
  idInvalid = 'Your ID invalid!',
  branchInvalid = 'Branch ID invalid!',
  getDataFail = 'Get data failed, please try again!',
  noPermissoin = 'Your account is not permission.',
  already = 'Already exist⚠️.',
  notFound = ' ⚠️⚠️⚠️ Data Not Found.',
}
