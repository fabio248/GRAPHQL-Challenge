import { PrismaService } from '../database/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../shared/repository.interface';

@Injectable()
export default class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.OrderWhereInput;
  }): Promise<Order[]> {
    const { skip, take, where } = params;

    return this.prisma.order.findMany({
      skip: skip || 0,
      take: take || 10,
      where,
      include: {
        orderDetails: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }
  findOne(where: Prisma.OrderWhereUniqueInput): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where,
      include: {
        orderDetails: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    });
  }
}
