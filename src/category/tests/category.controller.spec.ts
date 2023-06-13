import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from '../category.controller';
import { CategoryService } from '../category.service';
import {
  MockContextCategoryService,
  createMockCategoryService,
} from '../../shared/mocks/category/category.service.mock';
import { buildCategory } from '../../shared/generate';
import CategoryReponse from '../dto/response/category.dto';
import { Category } from '@prisma/client';
import { CreateCatalogDto } from '../dto/request/create-category.dto';

describe('CategoryController', () => {
  let controller: CatalogController;
  let mockService: MockContextCategoryService;
  const category = buildCategory() as unknown as CategoryReponse;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        { provide: CategoryService, useFactory: createMockCategoryService },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    mockService = module.get<MockContextCategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create a new category', async () => {
      mockService.create.mockResolvedValueOnce(category);

      const actual = await controller.create(
        category as unknown as CreateCatalogDto,
      );

      expect(actual).toEqual(category);
    });
  });

  describe('findAll', () => {
    it('should return a list of categories', async () => {
      const listCategories = [category, category, category];
      mockService.findAll.mockResolvedValueOnce(listCategories);

      const actual = await controller.findAll();

      expect(actual).toHaveLength(listCategories.length);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
      expect(actual[0]).toEqual(category);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockService.findOneById.mockResolvedValueOnce(category);

      const actual = await controller.findOne(`${category.id}`);

      expect(actual).toEqual(category);
      expect(mockService.findOneById).toHaveBeenCalledTimes(1);
    });
  });
});
