import { Injectable } from '@nestjs/common';
import { Product, Prisma, UserLikeProduct } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { ProductRepository } from '../shared/repository.interface';

@Injectable()
export default class PrismaProductRepository implements ProductRepository {
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
    });
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
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
  async createLike(
    data: Prisma.UserLikeProductCreateInput,
  ): Promise<UserLikeProduct> {
    return this.prisma.userLikeProduct.create({ data });
  }

  async findLike(userId: number, productId: number) {
    return this.prisma.userLikeProduct.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  }

  async deleteLike(
    where: Prisma.UserLikeProductWhereUniqueInput,
  ): Promise<UserLikeProduct> {
    return this.prisma.userLikeProduct.delete({
      where,
    });
  }

  async findLastLike(productId: number): Promise<UserLikeProduct | null> {
    return this.prisma.userLikeProduct.findFirst({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
