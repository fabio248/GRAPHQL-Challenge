import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { Response } from 'express';
import { Product } from '@prisma/client';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('skip') skip: number,
    @Query('take') take: number,
    @Query('categoryId') categoryId: number,
    @Query('embedDisabledProducts') disabledProduct: boolean,
  ) {
    const ONLY_ENABLE_PRODUCTS = true;
    const EMBED_DISABLE_PRODUCTS = !disabledProduct;

    return this.productsService.findAll({
      skip,
      take,
      where: {
        AND: [
          {
            categoryId: categoryId ? categoryId : undefined,
          },
        ],
        OR: [
          {
            isEnable: EMBED_DISABLE_PRODUCTS ?? ONLY_ENABLE_PRODUCTS,
          },
        ],
      },
    });
  }

  @Get(':postId')
  findOne(@Param('postId') postId: string) {
    return this.productsService.findOne(+postId);
  }

  @Patch(':postId')
  update(
    @Param('postId') postId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+postId, updateProductDto);
  }

  @Delete(':postId')
  async remove(@Res() res: Response, @Param('postId') postId: string) {
    const product: Product = await this.productsService.remove(+postId);
    res.json({ message: `product deleted with ${product.id}` });
  }
}
