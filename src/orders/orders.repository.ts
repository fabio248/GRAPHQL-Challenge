import { PrismaService } from '../database/prisma.service';
import { Order, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { GenericRepository } from '../shared/repository.interface';

@Injectable()
export default class PrismaOrderRepository implements GenericRepository<Order> {
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
  create(data: object): Promise<Order> {
    throw new Error('Method not implemented.');
  }
  update(params: {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.OrderUpdateInput;
  }): Promise<Order> {
    const { where, data } = params;

    return this.prisma.order.update({ where, data });
  }
  delete(where: object): Promise<Order> {
    throw new Error('Method not implemented.');
  }
}
