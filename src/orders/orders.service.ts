import { Inject, Injectable } from '@nestjs/common';
import { CartService } from '../cart/services/cart.service';
import { PrismaService } from '../database/prisma.service';
import OrderResponse from './dto/order-response.dto';
import { plainToInstance } from 'class-transformer';
import NoProductsInCarException from './exception/no-product-in-cart.exception';
import { OrderRepository } from '../shared/repository.interface';

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
              select: {
                name: true,
                price: true,
              },
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

    return plainToInstance(OrderResponse, response[POSITION_ORDER]);
  }

  async findAll(skip?: number, take?: number, userId?: number) {
    const listOrders = await this.orderRepository.findAll({
      skip,
      take,
      where: { userId },
    });

    return listOrders.map((order) => plainToInstance(OrderResponse, order));
  }

  async findOne(id: number): Promise<OrderResponse> {
    const order = await this.orderRepository.findOne({ id });

    return plainToInstance(OrderResponse, order);
  }
}
