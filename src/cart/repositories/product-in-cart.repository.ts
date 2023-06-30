import { Prisma, ProductInCar } from '@prisma/client';
import { GenericRepository } from '../../shared/repository.interface';
import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PrismaProductInCarRepository
  implements GenericRepository<ProductInCar>
{
  private readonly includedInfo = { product: { include: { category: true } } };

  constructor(private readonly prisma: PrismaService) {}

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductInCarWhereUniqueInput;
    where?: object | undefined;
  }): Promise<ProductInCar[]> {
    const { skip, take, cursor, where } = params;

    return this.prisma.productInCar.findMany({
      skip,
      take,
      cursor,
      include: this.includedInfo,
      where,
    });
  }

  findOne(
    where: Prisma.ProductInCarWhereUniqueInput,
  ): Promise<ProductInCar | null> {
    return this.prisma.productInCar.findUnique({
      where,
      include: this.includedInfo,
    });
  }

  create(data: Prisma.ProductInCarUncheckedCreateInput): Promise<ProductInCar> {
    return this.prisma.productInCar.create({
      data,
      include: this.includedInfo,
    });
  }

  update(params: {
    where: Prisma.ProductInCarWhereUniqueInput;
    data: Prisma.ProductInCarUpdateInput;
  }): Promise<ProductInCar> {
    const { where, data } = params;

    return this.prisma.productInCar.update({
      where,
      data,
      include: this.includedInfo,
    });
  }

  delete(where: Prisma.ProductInCarWhereUniqueInput): Promise<ProductInCar> {
    return this.prisma.productInCar.delete({
      where,
      include: this.includedInfo,
    });
  }
}
