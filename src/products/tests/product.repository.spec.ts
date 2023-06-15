import { Test, TestingModule } from '@nestjs/testing';
import PrismaProductRepository from '../prisma.product.repository';
import { PrismaService } from '../../database/prisma.service';
import { MockContext, createMockContext } from '../../shared/mocks/prisma.mock';
import { GenericRepository } from '../../shared/repository.interface';
import { Product } from '@prisma/client';
import { buildProduct, getDescription } from '../../shared/generate';

describe('PrismaProductRepository', () => {
  let repository: GenericRepository<Product>;
  let prismaMock: MockContext;
  const product = buildProduct() as unknown as Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaProductRepository,
        { provide: PrismaService, useFactory: createMockContext },
      ],
    }).compile();

    repository = module.get<PrismaProductRepository>(PrismaProductRepository);
    prismaMock = module.get<MockContext>(PrismaService);
  });
  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const listProduct = [
        buildProduct(),
        buildProduct(),
        buildProduct(),
      ] as unknown as Product[];

      prismaMock.product.findMany.mockResolvedValueOnce(listProduct);

      const actual = await repository.findAll({});

      expect(actual).toHaveLength(listProduct.length);
      expect(prismaMock.product.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a product ', async () => {
      prismaMock.product.findUnique.mockResolvedValueOnce(product);

      const actual = await repository.findOne({});

      expect(actual).toEqual(product);
      expect(prismaMock.product.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      prismaMock.product.create.mockResolvedValueOnce(product);

      const actual = await repository.create(product);

      expect(actual).toEqual(product);
      expect(prismaMock.product.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      product.description = getDescription();
      prismaMock.product.update.mockResolvedValueOnce(product);

      const actual = await repository.update({
        where: { id: product.id },
        data: { description: product.description },
      });

      expect(actual).toEqual(product);
      expect(prismaMock.product.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a product by id', async () => {
      prismaMock.product.delete.mockResolvedValueOnce(product);

      const actual = await repository.delete({ id: product.id });

      expect(actual).toEqual(product);
      expect(prismaMock.product.delete).toHaveBeenCalledTimes(1);
    });
  });
});
