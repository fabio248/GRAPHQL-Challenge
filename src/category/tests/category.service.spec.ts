import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import {
  MockContextCategoryRepo,
  createMockCategoryRepo,
} from '../../shared/mocks/category/category.repository.mock';
import { buildCategory } from '../../shared/generate';
import { CreateCategoryInput } from '../dto/inputs/create-category.input';
import { Category } from '@prisma/client';
import CategoryNotFoundException from '../expection/category-not-found.expection';

describe('CatalogService', () => {
  let service: CategoryService;
  let mockRepository: MockContextCategoryRepo;
  const category = buildCategory() as Category;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: 'CatalogRepository', useFactory: createMockCategoryRepo },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    mockRepository = module.get<MockContextCategoryRepo>('CatalogRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      mockRepository.create.mockResolvedValueOnce(category);

      const actual = await service.create(
        category as unknown as CreateCategoryInput,
      );

      expect(actual).toEqual(category);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const listProduct = [category, category, category];
      mockRepository.findAll.mockResolvedValueOnce(listProduct);

      const actual = await service.findAll();

      expect(actual).toEqual(listProduct);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an exists category', async () => {
      mockRepository.findOne.mockResolvedValueOnce(category);

      const actual = await service.findOneById(category.id);

      expect(actual).toEqual(category);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('throw an error when category does not exits', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      const actual = () => service.findOneById(category.id);

      expect(actual).rejects.toEqual(new CategoryNotFoundException());
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
