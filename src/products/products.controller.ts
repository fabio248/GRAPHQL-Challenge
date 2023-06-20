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
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { Request, Response } from 'express';
import { Product } from '@prisma/client';
import DeleteMessageProduct from './message-response/delete-message.response';
import RoleGuard from '../auth/strategies/role.guard';
import { PayloadJwt } from '../types/generic';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(RoleGuard('MANAGER'))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('embedDisabledProducts') disabledProduct?: boolean,
    @Query('notEmbedImages') notImages?: boolean,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('categoryId') categoryId?: number,
  ) {
    return this.productsService.findAll({
      skip,
      take,
      disabledProduct,
      categoryId,
      notImages,
    });
  }

  @Get(':postId')
  findOne(@Param('postId') postId: string) {
    return this.productsService.findOneById(+postId);
  }

  @Patch(':postId')
  @UseGuards(RoleGuard('MANAGER'))
  update(
    @Param('postId') postId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(+postId, updateProductDto);
  }

  @Delete(':postId')
  @UseGuards(RoleGuard('MANAGER'))
  async remove(@Res() res: Response, @Param('postId') postId: string) {
    const product: Product = await this.productsService.remove(+postId);

    res.send(new DeleteMessageProduct(product.id));
  }

  @Post('/:productId')
  @UseGuards(RoleGuard('CLIENT'))
  createLike(@Req() req: Request, @Param('productId') productId: number) {
    const user = req.user as PayloadJwt;

    return this.productsService.createLike(+user.sub, productId);
  }
}
