import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { OrderEntity } from './entities';
import { CurrentUser } from '../auth/decoratos/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [OrderEntity], {
    name: 'getMyOrders',
    description: 'Client can see a list of their orders',
  })
  getMyOrders(@CurrentUser(['CLIENT']) user: JwtPayload, skip = 0, take = 10) {
    return this.ordersService.findAll(skip, take, +user.sub);
  }

  @Query(() => [OrderEntity], {
    name: 'getListOrders',
    description: 'Manager can get a list of orders client',
  })
  findAll(@CurrentUser(['MANAGER']) _user: JwtPayload) {
    return this.ordersService.findAll();
  }

  @Query(() => OrderEntity, {
    name: 'getOneOrder',
    description: 'Manager and client can search one order by id',
  })
  findOne(
    @CurrentUser(['CLIENT', 'MANAGER']) _user: JwtPayload,
    @Args('orderId', { type: () => Int }) orderId: number,
  ) {
    return this.ordersService.findOne(orderId);
  }

  @Mutation(() => OrderEntity, {
    name: 'createOrder',
    description: 'Client can create a order from products that have on cart',
  })
  create(@CurrentUser(['CLIENT']) user: JwtPayload) {
    return this.ordersService.create(+user.sub);
  }
}
