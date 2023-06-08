import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GenericRepository } from 'src/shared/repository.interface';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user-response.dto';
import * as Jwt from 'jsonwebtoken';
import EmailAlreadyTakenExtension from './expections/email-already-taken.expection';
import UserNotFoundException from './expections/user-not-found.exception';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: GenericRepository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const listUser: User[] = await this.userRepository.findAll();

    return listUser.map((user) => plainToClass(UserDto, user));
  }

  async findOneById(userId: number): Promise<UserDto> {
    const user: User | null = await this.userRepository.findOne({ id: userId });

    if (!user) {
      throw new UserNotFoundException(userId);
    }

    return plainToClass(UserDto, user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.userRepository.findOne({ email });

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const isEmailAlreadyTaken = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (isEmailAlreadyTaken) {
      throw new EmailAlreadyTakenExtension();
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password: this.hashPassword(createUserDto.password),
    });

    return plainToClass(UserDto, user);
  }

  update(userId: number, updateUserDto: UpdateUserDto): UserDto {
    const { password } = updateUserDto;

    const params = {
      where: { id: userId },
      data: {
        ...updateUserDto,
        password: password ? this.hashPassword(password) : undefined,
      },
    };
    const updatedUser = this.userRepository.update(params);

    return plainToClass(UserDto, updatedUser);
  }

  async remove(userId: number): Promise<UserDto> {
    this.findOneById(userId);
    const user = this.userRepository.delete({ id: userId });

    return plainToClass(UserDto, user);
  }

  private hashPassword(password: string): string {
    return hashSync(password, 10);
  }

  async createAccessToken(user: UserDto) {
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

  private createPayload(user: UserDto) {
    const payload: Jwt.JwtPayload = {
      sub: user.id.toString(),
      role: user.role,
    };

    return payload;
  }
}
