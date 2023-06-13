import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCatalogDto } from './dto/request/create-category.dto';

@Controller('categories')
export class CatalogController {
  constructor(private readonly catalogService: CategoryService) {}

  @Post()
  create(@Body() createCatalogDto: CreateCatalogDto) {
    return this.catalogService.create(createCatalogDto);
  }

  @Get()
  findAll() {
    return this.catalogService.findAll();
  }

  @Get(':categoryId')
  async findOne(@Param('categoryId') categoryId: string) {
    return await this.catalogService.findOneById(+categoryId);
  }
}
