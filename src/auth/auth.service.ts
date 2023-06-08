import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async singIn(email: string, password: string): Promise<UserDto> {
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

    return plainToClass(UserDto, user);
  }

  async createAccessToken(user: UserDto): Promise<string> {
    return await this.userService.createAccessToken(user);
  }

  verifyPassword(password: string, encrytedPassword: string): boolean {
    return compareSync(password, encrytedPassword);
  }
}
