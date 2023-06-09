import { Inject, Injectable } from '@nestjs/common';
import { CreateCatalogDto } from './dto/request/create-category.dto';
import { GenericRepository } from 'src/shared/repository.interface';
import { Catalog } from '@prisma/client';
import CatalogNotFoundException from './expection/category-not-found.expection';
import { plainToClass } from 'class-transformer';
import CategoryReponse from './dto/response/category.dto';

@Injectable()
export class CatalogService {
  constructor(
    @Inject('CatalogRepository')
    private readonly catalogRepository: GenericRepository<Catalog>,
  ) {}

  async create(createCatalogDto: CreateCatalogDto) {
    const newCategory: Catalog = await this.catalogRepository.create(
      createCatalogDto,
    );

    return plainToClass(CategoryReponse, newCategory);
  }

  findAll() {
    return this.catalogRepository.findAll();
  }

  async findOneById(catalogId: number) {
    const catalog: Catalog | null = await this.catalogRepository.findOne({
      id: catalogId,
    });

    if (!catalog) {
      throw new CatalogNotFoundException();
    }

    return catalog;
  }
}
