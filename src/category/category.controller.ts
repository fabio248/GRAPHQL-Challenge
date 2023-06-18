import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCatalogDto } from './dto/request/create-category.dto';
import RoleGuard from '../auth/strategies/role.guard';

@Controller('categories')
export class CatalogController {
  constructor(private readonly catalogService: CategoryService) {}

  @Post()
  @UseGuards(RoleGuard('MANAGER'))
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
