import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserResponse } from '../users/dto/response/user-response.dto';
import AuthUnauthorizedException from './exception/unauthoried.expection';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async singIn(email: string, password: string): Promise<UserResponse> {
    const user: User | null = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new AuthUnauthorizedException();
    }

    const isMatchPassword: boolean = this.verifyPassword(
      password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new AuthUnauthorizedException();
    }

    return plainToClass(UserResponse, user);
  }

  async createAccessToken(user: UserResponse): Promise<string> {
    return await this.userService.createAccessToken(user);
  }

  verifyPassword(password: string, encrytedPassword: string): boolean {
    return bcrypt.compareSync(password, encrytedPassword);
  }
}
