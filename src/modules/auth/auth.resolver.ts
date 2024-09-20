import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { User } from '../user/entities/user.entity';
import { Login } from './entities/login.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/core/jwt/jwt.guard';
import { CurrentUser } from 'src/shares/user.decorator';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Login, { name: 'login' })
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Login, { name: 'me', nullable: true })
  findOne(@CurrentUser() user: User) {
    return this.authService.findOne(user);
  }
}
