import { Test, TestingModule } from '@nestjs/testing';
import { MockContext, createMockContext } from '../../shared/mocks/prisma.mock';
import { GenericRepository } from '../../shared/repository.interface';
import { PrismaService } from '../../database/prisma.service';
import { buildCart } from '../../shared/generate';
import { Cart } from '@prisma/client';
import PrismaCartRepository from '../repositories/cart.repository';

describe('PrismaCartRepository', () => {
  let repository: GenericRepository<Cart>;
  let mockPrisma: MockContext;
  const cart = buildCart() as unknown as Cart;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCartRepository,
        { provide: PrismaService, useFactory: createMockContext },
      ],
    }).compile();

    repository = module.get<PrismaCartRepository>(PrismaCartRepository);
    mockPrisma = module.get<MockContext>(PrismaService);
  });

  describe('create', () => {
    it('should create a cart entity', async () => {
      mockPrisma.cart.create.mockResolvedValueOnce(cart);

      const actual = await repository.create(cart);

      expect(actual).toEqual(cart);
      expect(mockPrisma.cart.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a cart searched by id', async () => {
      mockPrisma.cart.findUnique.mockResolvedValueOnce(cart);

      const actual = await repository.findOne({ id: cart.id });

      expect(actual).toEqual(cart);
      expect(mockPrisma.cart.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('return a list of cart', async () => {
      const listCart = [cart, cart, cart];
      mockPrisma.cart.findMany.mockResolvedValueOnce(listCart);

      const actual = await repository.findAll({});

      expect(actual).toHaveLength(listCart.length);
      expect(mockPrisma.cart.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a cart', async () => {
      mockPrisma.cart.update.mockResolvedValueOnce(cart);

      const actual = await repository.update({
        where: { id: cart.id },
        data: cart,
      });

      expect(actual).toEqual(cart);
      expect(mockPrisma.cart.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a cart', async () => {
      mockPrisma.cart.delete.mockResolvedValueOnce(cart);

      const actual = await repository.delete({
        where: { id: cart.id },
      });

      expect(actual).toEqual(cart);
      expect(mockPrisma.cart.delete).toHaveBeenCalledTimes(1);
    });
  });
});
