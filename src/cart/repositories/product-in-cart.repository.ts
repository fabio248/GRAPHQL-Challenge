import { Prisma, ProductInCar } from '@prisma/client';
import { GenericRepository } from '../../shared/repository.interface';
import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class PrismaProductInCarRepository
  implements GenericRepository<ProductInCar>
{
  constructor(private readonly prisma: PrismaService) {}

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProductInCarWhereUniqueInput;
    where?: object | undefined;
    include?: object | undefined;
  }): Promise<ProductInCar[]> {
    const { skip, take, cursor, include, where } = params;

    return this.prisma.productInCar.findMany({
      skip,
      take,
      cursor,
      include,
      where,
    });
  }
  findOne(
    where: Prisma.ProductInCarWhereUniqueInput,
  ): Promise<ProductInCar | null> {
    return this.prisma.productInCar.findUnique({ where });
  }

  create(data: Prisma.ProductInCarUncheckedCreateInput): Promise<ProductInCar> {
    return this.prisma.productInCar.create({
      data,
    });
  }

  update(params: {
    where: Prisma.ProductInCarWhereUniqueInput;
    data: Prisma.ProductInCarUpdateInput;
  }): Promise<ProductInCar> {
    const { where, data } = params;

    return this.prisma.productInCar.update({ where, data });
  }

  delete(where: Prisma.ProductInCarWhereUniqueInput): Promise<ProductInCar> {
    return this.prisma.productInCar.delete({ where });
  }
}
