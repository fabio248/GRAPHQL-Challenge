import { Injectable } from '@nestjs/common';
import { Product, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { GenericRepository } from 'src/shared/repository.interface';

@Injectable()
export default class PrismaProductRepository
  implements GenericRepository<Product>
{
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  findOne(where: Prisma.ProductWhereUniqueInput): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where,
      include: {
        catalog: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
      include: {
        catalog: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  update(params: {
    where: Prisma.ProductWhereUniqueInput;
    data: Prisma.ProductCreateInput;
  }): Promise<Product> {
    const { where, data } = params;

    return this.prisma.product.update({ where, data });
  }

  delete(where: Prisma.ProductWhereUniqueInput): Promise<Product> {
    return this.prisma.product.delete({ where });
  }
}
