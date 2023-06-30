import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/inputs/create-category.input';
import { GenericRepository } from '../shared/repository.interface';
import { Category } from '@prisma/client';
import CategoryNotFoundException from './expection/category-not-found.expection';
import { plainToClass, plainToInstance } from 'class-transformer';
import CategoryEntity from './entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CatalogRepository')
    private readonly catalogRepository: GenericRepository<Category>,
  ) {}

  async create(
    createCatalogInput: CreateCategoryInput,
  ): Promise<CategoryEntity> {
    const newCategory: Category = await this.catalogRepository.create(
      createCatalogInput,
    );

    return plainToClass(CategoryEntity, newCategory);
  }

  async findAll(
    params: { take: number; skip: number } = { take: 10, skip: 0 },
  ): Promise<CategoryEntity[]> {
    const { take, skip } = params;
    const listCategories: Category[] = await this.catalogRepository.findAll({
      take,
      skip,
    });

    return listCategories.map((category: Category) =>
      plainToInstance(CategoryEntity, category),
    );
  }

  async findOneById(catalogId: number) {
    const category: Category | null = await this.catalogRepository.findOne({
      id: catalogId,
    });

    if (!category) {
      throw new CategoryNotFoundException();
    }

    return plainToInstance(CategoryEntity, category);
  }
}
