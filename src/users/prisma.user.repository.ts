import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { GenericRepository } from '../shared/repository.interface';

@Injectable()
export class PrismaUserRepository implements GenericRepository<User> {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { skip?: number; take?: number }): Promise<User[]> {
    const { skip, take } = params;

    return this.prisma.user.findMany({
      skip: skip || 0,
      take: take || 10,
    });
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
      include: { cart: true, orders: true },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    return this.prisma.user.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({ where });
  }
}
