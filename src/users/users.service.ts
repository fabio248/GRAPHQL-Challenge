import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { GenericRepository } from 'src/shared/repository.interface';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserResponse } from './dto/response/user-response.dto';
import * as Jwt from 'jsonwebtoken';
import EmailAlreadyTakenException from './expections/email-already-taken.expection';
import UserNotFoundException from './expections/user-not-found.exception';
import { PayloadJwt } from '../types/generic';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: GenericRepository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(params: {
    skip?: number;
    take?: number;
  }): Promise<UserResponse[]> {
    const { skip, take } = params;

    const listUser: User[] = await this.userRepository.findAll({
      skip: skip,
      take: take,
    });

    return listUser.map((user) => plainToInstance(UserResponse, user));
  }

  async findOneById(userId: number): Promise<UserResponse> {
    const user: User | null = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new UserNotFoundException();
    }

    return plainToInstance(UserResponse, user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({ email });

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const isEmailAlreadyTaken = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (isEmailAlreadyTaken) {
      throw new EmailAlreadyTakenException();
    }

    const user = await this.userRepository.create({
      ...createUserDto,
      password: this.hashPassword(createUserDto.password),
    });

    return plainToInstance(UserResponse, user);
  }

  update(userId: number, updateUserDto: UpdateUserDto): UserResponse {
    const { password } = updateUserDto;

    const params = {
      where: { id: userId },
      data: {
        ...updateUserDto,
        password: password ? this.hashPassword(password) : undefined,
      },
    };
    const updatedUser = this.userRepository.update(params);

    return plainToInstance(UserResponse, updatedUser);
  }

  async remove(userId: number): Promise<UserResponse> {
    this.findOneById(userId);
    const user = this.userRepository.delete({ id: userId });

    return plainToInstance(UserResponse, user);
  }

  private hashPassword(password: string): string {
    return hashSync(password, 10);
  }

  async createAccessToken(user: User) {
    const jwtSecret = this.configService.get('JWT_SECRET');

    const payload: Jwt.JwtPayload = this.createPayload(user);

    const accessToken: string = Jwt.sign(payload, jwtSecret);

    const params = {
      where: { id: user.id },
      data: { accessToken },
    };

    await this.userRepository.update(params);

    return accessToken;
  }

  private createPayload(user: User) {
    const payload: PayloadJwt = {
      sub: user.id.toString(),
      role: user.role,
    };

    return payload;
  }
}
