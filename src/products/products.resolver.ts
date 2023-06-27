import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decoratos/current-user.decorator';
import { CreateProductInput, UpdateProductInput } from './dto/inputs';
import { ProductArgs } from './dto/args/product.arg';
import { Product } from '@prisma/client';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [ProductEntity], {
    name: 'getListProducts',
    description: 'get a list of products without authentication',
  })
  findAll(@Args({ nullable: true }) params: ProductArgs) {
    return this.productsService.findAll(params);
  }

  @Query(() => ProductEntity, {
    name: 'getOneProduct',
    description: 'get one product search by id',
  })
  findOne(@Args('productId', { type: () => Int }) productId: number) {
    return this.productsService.findOneById(productId);
  }

  @Mutation(() => ProductEntity, {
    name: 'createProduct',
    description: 'Manager can create a new product',
  })
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser(['MANAGER']) _user: JwtPayload,
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<Product> {
    return this.productsService.create(createProductInput);
  }

  @Mutation(() => ProductEntity, {
    name: 'updateProduct',
    description: 'Manager can update a product by id',
  })
  @UseGuards(JwtAuthGuard)
  update(
    @CurrentUser(['MANAGER']) _user: JwtPayload,
    @Args('productId', { type: () => Int }) productId: number,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    return this.productsService.update(productId, updateProductInput);
  }

  @Mutation(() => ProductEntity, {
    name: 'changeProductStatus',
    description:
      'Manager can active or desactive a product by id, if the product is active this will be desactive and vice versa',
  })
  @UseGuards(JwtAuthGuard)
  changeStatus(
    @CurrentUser(['MANAGER']) _user: JwtPayload,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return this.productsService.changeProductStatus(productId);
  }

  @Mutation(() => ProductEntity, {
    name: 'deleteProduct',
    description: 'Manager can delete a product by id',
  })
  @UseGuards(JwtAuthGuard)
  delete(
    @CurrentUser(['MANAGER']) _user: JwtPayload,
    @Args('productId', { type: () => Int }) productId: number,
  ) {
    return this.productsService.remove(productId);
  }
}
