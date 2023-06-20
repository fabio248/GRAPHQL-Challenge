import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './services/cart.service';
import ProductInCartService from './services/product-in-cart.service';
import CreateProductInCarDto from './dto/request/create-product-in-cat';
import RemoveProductInCartDto from './dto/request/remove-product-in-cart.dto';
import RoleGuard from '../auth/strategies/role.guard';
import { Request } from 'express';
import { PayloadJwt } from '../types/generic';

@Controller('carts')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productInCarService: ProductInCartService,
  ) {}

  @Post(':userId')
  @UseGuards(RoleGuard('MANAGER', 'CLIENT'))
  create(@Param('userId') userId: number) {
    return this.cartService.create(userId);
  }

  @Post('my-cart/add-product')
  @UseGuards(RoleGuard('MANAGER', 'CLIENT'))
  addProduct(
    @Req() req: Request,
    @Body() createProdcutInCar: CreateProductInCarDto,
  ) {
    const user = req.user as PayloadJwt;

    return this.productInCarService.create(createProdcutInCar, +user.sub);
  }

  @Get()
  @UseGuards(RoleGuard('MANAGER'))
  findAll() {
    return this.cartService.findAll();
  }

  @Get('/my-cart')
  @UseGuards(RoleGuard('CLIENT'))
  findOne(@Req() req: Request) {
    const user = req.user as PayloadJwt;

    return this.cartService.findOneByUserId(+user.sub);
  }

  @Delete('my-cart/remove-product')
  @UseGuards(RoleGuard('MANAGER', 'CLIENT'))
  remove(
    @Req() req: Request,
    @Body() removeProductInCartDto: RemoveProductInCartDto,
  ) {
    const user = req.user as PayloadJwt;

    return this.productInCarService.remove(
      +user.sub,
      removeProductInCartDto.productId,
    );
  }
}
