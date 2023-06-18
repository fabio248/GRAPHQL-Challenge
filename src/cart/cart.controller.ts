import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './services/cart.service';
import { UpdateCartDto } from './dto/request/update-cart.dto';
import ProductInCartService from './services/product-in-cart.service';
import CreateProductInCarDto from './dto/request/create-product-in-cat';
import RemoveProductInCartDto from './dto/request/remove-product-in-cart.dto';
import RoleGuard from '../auth/strategies/role.guard';

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

  @Post(':cartId/add-product')
  @UseGuards(RoleGuard('MANAGER', 'CLIENT'))
  addProduct(
    @Param('cartId') cartId: number,
    @Body() createProdcutInCar: CreateProductInCarDto,
  ) {
    return this.productInCarService.create(createProdcutInCar, cartId);
  }

  @Get()
  @UseGuards(RoleGuard('MANAGER', 'CLIENT'))
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':cartId')
  @UseGuards(RoleGuard('MANAGER', 'CLIENT'))
  findOne(@Param('cartId') id: string) {
    return this.cartService.findOneById(+id);
  }

  @Patch(':cartId')
  @UseGuards(RoleGuard('MANAGER', 'CLIENT'))
  update(@Param('cartId') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':cartId/remove-product')
  @UseGuards(RoleGuard('MANAGER', 'CLIENT'))
  remove(
    @Param('cartId') cartId: string,
    @Body() removeProductInCartDto: RemoveProductInCartDto,
  ) {
    return this.productInCarService.remove(
      +cartId,
      removeProductInCartDto.productId,
    );
  }
}
