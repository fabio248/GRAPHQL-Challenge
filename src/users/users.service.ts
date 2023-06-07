import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GenericRepository } from 'src/shared/repository.interface';
import { User } from '@prisma/client';
import { hashSync } from 'bcrypt';
import UserNotFoundException from './expections/user-not-found.exception';
import EmailAlreadyTakenExtension from './expections/email-already-taken.expection';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: GenericRepository<User>,
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
}
