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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';

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
    const EMBEB_DISABLED_PRODUCTS = false;

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
          { isEnable: true },
          {
            isEnable: disabledProduct ? EMBEB_DISABLED_PRODUCTS : true,
          },
        ],
      },
    });
  }

  @Get(':postId')
  findOne(@Param('postId') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':postId')
  update(
    @Param('postId') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':postId')
  remove(@Param('postId') id: string) {
    return this.productsService.remove(+id);
  }
}
