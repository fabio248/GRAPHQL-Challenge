import { PrismaService } from '../database/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../shared/repository.interface';

@Injectable()
export default class PrismaOrderRepository implements OrderRepository {
  private readonly includedInfo = {
    user: true,
    orderDetails: {
      include: {
        product: {
          include: { category: true, images: true },
        },
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrderWhereInput;
  }): Promise<Order[]> {
    const { skip, take, where } = params;

    return this.prisma.order.findMany({
      skip: skip || 0,
      take: take || 10,
      where,
      include: this.includedInfo,
    });
  }
  async findOne(where: Prisma.OrderWhereUniqueInput): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where,
      include: this.includedInfo,
    });
  }
}
