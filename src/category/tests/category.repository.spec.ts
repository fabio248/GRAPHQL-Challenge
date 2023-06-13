import { Category } from '@prisma/client';
import { GenericRepository } from '../../shared/repository.interface';
import { MockContext, createMockContext } from '../../shared/mocks/prisma.mock';
import { buildCategory, getDescription } from '../../shared/generate';
import { Test, TestingModule } from '@nestjs/testing';
import PrismaCategoryRepository from '../prisma.category.repository';
import { PrismaService } from '../../database/prisma.service';

describe('PrismaProductRepository', () => {
  let repository: GenericRepository<Category>;
  let prismaMock: MockContext;
  const category = buildCategory() as unknown as Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCategoryRepository,
        { provide: PrismaService, useFactory: createMockContext },
      ],
    }).compile();

    repository = module.get<PrismaCategoryRepository>(PrismaCategoryRepository);
    prismaMock = module.get<MockContext>(PrismaService);
  });
  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const listCategory = [
        category,
        category,
        category,
      ] as unknown as Category[];

      prismaMock.category.findMany.mockResolvedValueOnce(listCategory);

      const actual = await repository.findAll({});

      expect(actual).toHaveLength(listCategory.length);
      expect(prismaMock.category.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a category ', async () => {
      prismaMock.category.findUnique.mockResolvedValueOnce(category);

      const actual = await repository.findOne({});

      expect(actual).toEqual(category);
      expect(prismaMock.category.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      prismaMock.category.create.mockResolvedValueOnce(category);

      const actual = await repository.create(category);

      expect(actual).toEqual(category);
      expect(prismaMock.category.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      category.description = getDescription();
      prismaMock.category.update.mockResolvedValueOnce(category);

      const actual = await repository.update({
        where: { id: category.id },
        data: { description: category.description },
      });

      expect(actual).toEqual(category);
      expect(prismaMock.category.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a category by id', async () => {
      prismaMock.category.delete.mockResolvedValueOnce(category);

      const actual = await repository.delete({ id: category.id });

      expect(actual).toEqual(category);
      expect(prismaMock.category.delete).toHaveBeenCalledTimes(1);
    });
  });
});
