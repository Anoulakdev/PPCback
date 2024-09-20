import mongoose from 'mongoose';
export const checkId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
