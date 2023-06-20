import { Test, TestingModule } from '@nestjs/testing';
import { MockContext, createMockContext } from '../../shared/mocks/prisma.mock';
import { PrismaService } from '../../database/prisma.service';
import { buildOrder, getId } from '../../shared/generate';
import { Order } from '@prisma/client';
import { OrderRepository } from '../../shared/repository.interface';
import PrismaOrderRepository from '../orders.repository';

describe('PrismaOrderRepository', () => {
  let repository: OrderRepository;
  let prismaMock: MockContext;
  let order = buildOrder() as unknown as Order;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaOrderRepository,
        { provide: PrismaService, useFactory: createMockContext },
      ],
    }).compile();
    repository = module.get<PrismaOrderRepository>(PrismaOrderRepository);
    prismaMock = module.get<MockContext>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of order', async () => {
      const listOrder = [
        buildOrder(),
        buildOrder(),
        buildOrder(),
      ] as unknown as Order[];
      prismaMock.order.findMany.mockResolvedValueOnce(listOrder);

      const actual = await repository.findAll({});

      expect(actual).toEqual(listOrder);
      expect(actual).toHaveLength(listOrder.length);
    });
  });

  describe('findOne', () => {
    it('should return a specific user', async () => {
      const id = getId;
      order = { ...order, id };
      prismaMock.order.findUnique.mockResolvedValueOnce(order);

      const actual = await repository.findOne({ id });

      expect(actual).toEqual(order);
      expect(prismaMock.order.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
