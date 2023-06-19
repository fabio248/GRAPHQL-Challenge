import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from '../database/database.module';
import PrismaCartRepository from './repositories/cart.repository';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import ProductInCartService from './services/product-in-cart.service';
import PrismaProductInCarRepository from './repositories/product-in-cart.repository';

@Module({
  imports: [DatabaseModule, UsersModule, ProductsModule],
  providers: [
    { provide: 'CartRepository', useClass: PrismaCartRepository },
    {
      provide: 'ProductInCarRepository',
      useClass: PrismaProductInCarRepository,
    },
    CartService,
    ProductInCartService,
  ],
  controllers: [CartController],
  exports: [
    CartService,
    { provide: 'CartRepository', useClass: PrismaCartRepository },
  ],
})
export class CartModule {}
