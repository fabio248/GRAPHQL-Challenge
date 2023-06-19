import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartModule } from '../cart/cart.module';
import { DatabaseModule } from '../database/database.module';
import { CartService } from '../cart/services/cart.service';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import PrismaOrderRepository from './orders.repository';

@Module({
  imports: [DatabaseModule, CartModule, UsersModule, ProductsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    CartService,
    { provide: 'OrderRepository', useClass: PrismaOrderRepository },
  ],
})
export class OrdersModule {}
