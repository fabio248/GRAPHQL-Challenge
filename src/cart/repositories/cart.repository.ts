import { Cart, Prisma } from '@prisma/client';
import { GenericRepository } from '../../shared/repository.interface';
import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PrismaCartRepository implements GenericRepository<Cart> {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CartWhereUniqueInput;
    include?: Prisma.CartInclude;
  }): Promise<Cart[]> {
    const { skip, take, where, include } = params;

    return this.prisma.cart.findMany({
      skip,
      take,
      where,
      include,
    });
  }

  async findOne(where: Prisma.CartWhereUniqueInput): Promise<Cart | null> {
    return this.prisma.cart.findUnique({
      where,
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(data: Prisma.CartCreateInput): Promise<Cart> {
    return this.prisma.cart.create({ data });
  }

  async update(params: {
    where: Prisma.CartWhereUniqueInput;
    data: Prisma.CartUpdateInput;
  }): Promise<Cart> {
    const { where, data } = params;
    return this.prisma.cart.update({ where, data });
  }

  async delete(where: Prisma.CartWhereUniqueInput): Promise<Cart> {
    return this.prisma.cart.delete({ where });
  }
}
