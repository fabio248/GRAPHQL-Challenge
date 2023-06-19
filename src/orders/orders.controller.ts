import { PayloadJwt } from 'src/types/generic';
import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import RoleGuard from '../auth/strategies/role.guard';
import { Request } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/me')
  @UseGuards(RoleGuard('CLIENT'))
  create(@Req() req: Request) {
    const user = req.user as PayloadJwt;

    return this.ordersService.create(+user.sub);
  }

  @Get()
  @UseGuards(RoleGuard('MANAGER'))
  findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return this.ordersService.findAll(skip, take);
  }

  @Get('my-orders')
  @UseGuards(RoleGuard('CLIENT'))
  findAllByUser(
    @Req() req: Request,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    const user = req.user as PayloadJwt;

    return this.ordersService.findAll(skip, take, +user.sub);
  }

  @Get(':id')
  @UseGuards(RoleGuard('CLIENT'))
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
}
