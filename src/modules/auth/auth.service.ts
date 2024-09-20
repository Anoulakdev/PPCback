import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { checkId } from 'src/shares/checkId';
import { Message } from 'src/types';

const populate = {
  path: 'roleId customerId customers',
};
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(login: LoginInput) {
    const condition = { email: login.user, isActive: true };
    let data = await this.userModel.findOne(condition).populate(populate);
    // console.log(data);

    if (!data) return new BadRequestException('User or Password incorrect');
    if (data && (await bcrypt.compare(login.password, data.password))) {
      const updateToken = await this.userModel
        .findOneAndUpdate(
          { _id: data._id },
          { versionToken: data.versionToken + 1 },
          { new: true },
        )
        .populate(populate);

      if (!updateToken)
        return new BadRequestException('Update Token version fail!');
      data = JSON.parse(JSON.stringify(updateToken));
      delete data.password;
      const accessToken = this.jwtService.sign({
        _id: data._id,
        versionToken: data.versionToken,
      });
      return {
        accessToken,
        data,
      };
    }
    return new BadRequestException('User or Password incorrect');
  }

  async findOne(user: User) {
    if (!checkId(user._id)) return new BadRequestException(Message.idInvalid);
    const data = await this.userModel
      .findOne({ _id: user._id, isActive: true })
      .populate(populate);
    if (!data) return new BadRequestException('User Not found!');
    const updateToken = await this.userModel.findOneAndUpdate(
      { _id: data._id },
      { versionToken: data.versionToken + 1 },
      { new: true },
    );

    if (!updateToken)
      return new BadRequestException('Update Token version fail!');

    const accessToken = this.jwtService.sign({
      _id: data._id,
      versionToken: updateToken.versionToken,
    });
    return {
      accessToken,
      data,
    };
  }
}
