/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CartEntity } from './entities';
import { CurrentUser } from '../auth/decoratos/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CartService } from './services/cart.service';
import ProductInCartService from './services/product-in-cart.service';
import { ProductInCarEntity } from './entities';
import { CreateProductInCarInput, RemoveProductInCartInput } from './dto/input';

@Resolver()
@UseGuards(JwtAuthGuard)
export class CartResolver {
  constructor(
    private readonly cartService: CartService,
    private readonly productInCarService: ProductInCartService,
  ) {}

  @Query(() => [CartEntity], {
    name: 'getListCarts',
    description: 'Manager can get a list of all carts',
  })
  findAll(@CurrentUser(['MANAGER']) _user: JwtPayload) {
    return this.cartService.findAll();
  }

  @Query(() => CartEntity, {
    name: 'getMyCart',
    description: 'Client can get their own cart and products in cart',
  })
  findOne(@CurrentUser(['CLIENT']) user: JwtPayload) {
    return this.cartService.findOneByUserId(+user.sub);
  }

  @Mutation(() => CartEntity, {
    name: 'createCart',
    description: 'create a cart associated with the authenticated user',
  })
  create(@CurrentUser(['CLIENT']) user: JwtPayload): Promise<CartEntity> {
    return this.cartService.create(+user.sub);
  }

  @Mutation(() => ProductInCarEntity, {
    name: 'addProductToMyCart',
    description: 'Client can add product to their cart',
  })
  addProduct(
    @CurrentUser(['CLIENT']) user: JwtPayload,
    @Args('createProductInCar')
    createProductInCarInput: CreateProductInCarInput,
  ) {
    return this.productInCarService.create(createProductInCarInput, +user.sub);
  }

  @Mutation(() => ProductInCarEntity, {
    name: 'removeProductToMyCart',
    description: 'Client can delete specific product by id',
  })
  removeProduct(
    @CurrentUser(['CLIENT']) user: JwtPayload,
    @Args('removeProductInCartInput')
    removeProductInCartInput: RemoveProductInCartInput,
  ) {
    return this.productInCarService.remove(+user.sub, removeProductInCartInput);
  }
}
