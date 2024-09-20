import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/modules/user/entities/user.entity';

@ObjectType()
export class Login {
  @Field(() => String)
  accessToken: string;
  @Field(() => User)
  data: User;
}
