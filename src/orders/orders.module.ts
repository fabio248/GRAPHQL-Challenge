import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CartModule } from '../cart/cart.module';
import { DatabaseModule } from '../database/database.module';
import { CartService } from '../cart/services/cart.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { OrdersResolver } from './orders.resolver';
import PrismaOrderRepository from './orders.repository';

@Module({
  imports: [DatabaseModule, CartModule, UsersModule, ProductsModule],
  providers: [
    OrdersService,
    CartService,
    { provide: 'OrderRepository', useClass: PrismaOrderRepository },
    OrdersResolver,
  ],
})
export class OrdersModule {}
