import { Test, TestingModule } from '@nestjs/testing';
import { MockContext, createMockContext } from '../../shared/mocks/prisma.mock';
import { GenericRepository } from '../../shared/repository.interface';
import { PrismaService } from '../../database/prisma.service';
import { buildProductInCart, getId } from '../../shared/generate';
import { ProductInCar } from '@prisma/client';
import PrismaProductInCarRepository from '../repositories/product-in-cart.repository';

describe('PrismaCartRepository', () => {
  let repository: GenericRepository<ProductInCar>;
  let mockPrisma: MockContext;
  const productInCart = buildProductInCart({
    cartId: getId,
    productIn: getId,
  }) as unknown as ProductInCar;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaProductInCarRepository,
        { provide: PrismaService, useFactory: createMockContext },
      ],
    }).compile();

    repository = module.get<PrismaProductInCarRepository>(
      PrismaProductInCarRepository,
    );
    mockPrisma = module.get<MockContext>(PrismaService);
  });

  describe('create', () => {
    it('should create a product in cart entity', async () => {
      mockPrisma.productInCar.create.mockResolvedValueOnce(productInCart);

      const actual = await repository.create(productInCart);

      expect(actual).toEqual(productInCart);
      expect(mockPrisma.productInCar.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a product in cart searched by id', async () => {
      mockPrisma.productInCar.findUnique.mockResolvedValueOnce(productInCart);

      const actual = await repository.findOne({
        where: {
          cartId_productId: {
            cartId: productInCart.cartId,
            productId: productInCart.productId,
          },
        },
      });

      expect(actual).toEqual(productInCart);
      expect(mockPrisma.productInCar.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('return a list of products is cart', async () => {
      const listProductInCart = [productInCart, productInCart, productInCart];
      mockPrisma.productInCar.findMany.mockResolvedValueOnce(listProductInCart);

      const actual = await repository.findAll({});

      expect(actual).toHaveLength(listProductInCart.length);
      expect(mockPrisma.productInCar.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a product in cart', async () => {
      mockPrisma.productInCar.update.mockResolvedValueOnce(productInCart);

      const actual = await repository.update({
        where: {
          cartId_productId: {
            cartId: productInCart.cartId,
            productId: productInCart.productId,
          },
        },
        data: productInCart,
      });

      expect(actual).toEqual(productInCart);
      expect(mockPrisma.productInCar.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a product in cart', async () => {
      mockPrisma.productInCar.delete.mockResolvedValueOnce(productInCart);

      const actual = await repository.delete({
        where: {
          cartId_productId: {
            cartId: productInCart.cartId,
            productId: productInCart.productId,
          },
        },
      });

      expect(actual).toEqual(productInCart);
      expect(mockPrisma.productInCar.delete).toHaveBeenCalledTimes(1);
    });
  });
});
