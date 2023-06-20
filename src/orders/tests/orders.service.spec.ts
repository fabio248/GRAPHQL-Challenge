import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';
import { CartService } from '../../cart/services/cart.service';
import { PrismaService } from '../../database/prisma.service';
import {
  MockContextOrderRepo,
  createMockOrderRepo,
} from '../../shared/mocks/orders/order.repository.mock';
import {
  MockContextCartService,
  createMockCartService,
} from '../../shared/mocks/cart/cart.service.mock';
import { MockContext, createMockContext } from '../../shared/mocks/prisma.mock';
import CartResponse from '../../cart/dto/response/car-response.dto';
import { buildCart, buildOrder, getId } from '../../shared/generate';
import NoProductsInCarException from '../exception/no-product-in-cart.exception';
import { Order } from '@prisma/client';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockRepo: MockContextOrderRepo;
  let mockPrisma: MockContext;
  let mockCartService: MockContextCartService;
  const order = buildOrder() as unknown as Order;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: CartService, useFactory: createMockCartService },
        PrismaService,
        { provide: 'OrderRepository', useFactory: createMockOrderRepo },
        { provide: PrismaService, useFactory: createMockContext },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    mockRepo = module.get<MockContextOrderRepo>('OrderRepository');
    mockPrisma = module.get<MockContext>(PrismaService);
    mockCartService = module.get<MockContextCartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let cart = buildCart() as unknown as CartResponse;
    const userId = getId;

    it('should create a new order', async () => {
      const order = cart;
      mockCartService.findOneByUserId.mockResolvedValueOnce(cart);
      mockPrisma.$transaction.mockResolvedValueOnce([
        order,
        cart,
        cart.products,
      ]);
      const actual = await service.create(userId);

      expect(actual).toEqual(order);
    });

    it('throw an error when does not exits products in car', async () => {
      cart = buildCart({ products: [] }) as unknown as CartResponse;

      mockCartService.findOneByUserId.mockResolvedValueOnce(cart);

      const actual = () => service.create(userId);

      expect(actual).rejects.toEqual(new NoProductsInCarException());
      expect(mockCartService.findOneByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return a list of orders', async () => {
      const listOrders = [order, order, order];
      mockRepo.findAll.mockResolvedValueOnce(listOrders);

      const actual = await service.findAll();

      expect(actual).toHaveLength(listOrders.length);
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a order', async () => {
      mockRepo.findOne.mockResolvedValueOnce(order);

      const actual = await service.findOne(order.id);

      expect(actual).toEqual(order);
      expect(mockRepo.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
