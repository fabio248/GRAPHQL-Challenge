import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CartService } from '../cart/services/cart.service';
import { PrismaService } from '../database/prisma.service';
import { OrderEntity } from './entities';
import { plainToInstance } from 'class-transformer';
import NoProductsInCarException from './exception/no-product-in-cart.exception';
import { OrderRepository } from '../shared/repository.interface';
import NoEnoughStockException from '../cart/expections/no-enough-stock.exception';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('OrderRepository')
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: number) {
    const POSITION_ORDER = 0;
    const NOT_PRODUCTS_IN_CART = 0;
    const productToUpdateStock = [];
    const clearProductInCart = [];

    const {
      id: cartId,
      total,
      products: productsInCar,
    } = await this.cartService.findOneByUserId(userId);

    if (productsInCar.length === NOT_PRODUCTS_IN_CART) {
      throw new NoProductsInCarException();
    }

    for (const { product, quantity } of productsInCar) {
      if (product.stock < quantity) {
        throw new NoEnoughStockException(product.id);
      }
      //add all products that have to update stock
      productToUpdateStock.push(
        this.prisma.product.update({
          where: { id: product.id },
          data: { stock: product.stock - quantity },
        }),
      );

      clearProductInCart.push(
        this.prisma.productInCar.delete({
          where: {
            cartId_productId: {
              cartId,
              productId: product.id,
            },
          },
        }),
      );
    }

    const clearCart = this.prisma.cart.update({
      where: { id: cartId },
      data: { total: 0 },
    });

    const createOrdersDetail = productsInCar.map(
      ({ quantity, subtotal, product }) => ({
        quantity,
        subtotal,
        productId: product.id,
      }),
    );

    const createOrdersWithDetails = this.prisma.order.create({
      data: {
        total,
        userId,
        orderDetails: {
          createMany: {
            data: createOrdersDetail,
          },
        },
      },
      include: {
        orderDetails: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    });

    const response = await this.prisma.$transaction([
      createOrdersWithDetails,
      clearCart,
      ...clearProductInCart,
      ...productToUpdateStock,
    ]);

    return response[POSITION_ORDER];
  }

  async findAll(skip?: number, take?: number, userId?: number) {
    return this.orderRepository.findAll({
      skip,
      take,
      where: { userId },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ id });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}
