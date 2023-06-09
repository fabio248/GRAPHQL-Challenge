import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserResponse } from 'src/users/dto/response/user-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async singIn(email: string, password: string): Promise<UserResponse> {
    const user: User | null = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('credentials invalids');
    }

    const isMatchPassword: boolean = this.verifyPassword(
      password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new UnauthorizedException('credentials invalids');
    }

    return plainToClass(UserResponse, user);
  }

  async createAccessToken(user: UserResponse): Promise<string> {
    return await this.userService.createAccessToken(user);
  }

  verifyPassword(password: string, encrytedPassword: string): boolean {
    return compareSync(password, encrytedPassword);
  }
}
