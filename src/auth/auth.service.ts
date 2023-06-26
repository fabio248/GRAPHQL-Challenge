import { SignInInput } from './dto/input/sign-in.input';
import { SignUpInput } from './dto/input/sign-up.input';
import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserResponse } from '../users/dto/response/user-response.dto';
import AuthUnauthorizedException from './exception/unauthoried.expection';
import { AuthResponse } from './dto/types/auth-response.types';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signUp(singUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.userService.create(singUpInput);
    const accessToken = await this.userService.createAccessToken(user);

    return { user, accessToken };
  }

  async singIn(signInInput: SignInInput): Promise<AuthResponse> {
    const { password, email } = signInInput;
    const user: User | null = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new AuthUnauthorizedException();
    }

    const isMatchPassword: boolean = bcrypt.compareSync(
      password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new AuthUnauthorizedException();
    }

    const accessToken = await this.userService.createAccessToken(user);

    return { user, accessToken };
  }
}
