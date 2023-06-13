import { Inject, Injectable } from '@nestjs/common';
import { CreateCatalogDto } from './dto/request/create-category.dto';
import { GenericRepository } from '../shared/repository.interface';
import { Category } from '@prisma/client';
import CategoryNotFoundException from './expection/category-not-found.expection';
import { plainToClass, plainToInstance } from 'class-transformer';
import CategoryReponse from './dto/response/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CatalogRepository')
    private readonly catalogRepository: GenericRepository<Category>,
  ) {}

  async create(createCatalogDto: CreateCatalogDto): Promise<CategoryReponse> {
    const newCategory: Category = await this.catalogRepository.create(
      createCatalogDto,
    );

    return plainToClass(CategoryReponse, newCategory);
  }

  async findAll(
    params: { take: number; skip: number } = { take: 10, skip: 0 },
  ): Promise<CategoryReponse[]> {
    const { take, skip } = params;
    const listCategories: Category[] = await this.catalogRepository.findAll({
      take,
      skip,
    });

    return listCategories.map((category: Category) =>
      plainToInstance(CategoryReponse, category),
    );
  }

  async findOneById(catalogId: number) {
    const category: Category | null = await this.catalogRepository.findOne({
      id: catalogId,
    });

    if (!category) {
      throw new CategoryNotFoundException();
    }

    return plainToInstance(CategoryReponse, category);
  }
}
