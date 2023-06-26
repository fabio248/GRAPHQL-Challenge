import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import CategoryEntity from './entity/category.entity';
import { CurrentUser } from '../auth/decoratos/current-user.decorator';
import { JwtPayload } from 'jsonwebtoken';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [CategoryEntity], {
    name: 'listCategories',
    description: 'get categories list',
  })
  findAll(@CurrentUser(['MANAGER']) _: JwtPayload) {
    return this.categoryService.findAll();
  }

  @Mutation(() => CategoryEntity, {
    name: 'createCategory',
    description: 'Manager can create a new category for products',
  })
  create(
    @CurrentUser(['MANAGER']) _user: JwtPayload,
    @Args('createCategoryInput') createCatalogInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(createCatalogInput);
  }
}
