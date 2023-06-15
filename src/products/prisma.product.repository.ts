import { Injectable } from '@nestjs/common';
import { Product, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { GenericRepository } from '../shared/repository.interface';

@Injectable()
export default class PrismaProductRepository
  implements GenericRepository<Product>
{
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
    include?: Prisma.ProductInclude;
  }): Promise<Product[]> {
    const { skip, take, where, include } = params;

    return this.prisma.product.findMany({
      skip: skip || 0,
      take: take || 10,
      where,
      include,
    });
  }

  async findOne(
    where: Prisma.ProductWhereUniqueInput,
  ): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where,
      include: {
        category: true,
        images: true,
      },
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: Prisma.ProductCreateInput;
  }): Promise<Product> {
    const { where, data } = params;

    return this.prisma.product.update({ where, data });
  }

  async delete(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    return this.prisma.product.delete({ where });
  }
}
