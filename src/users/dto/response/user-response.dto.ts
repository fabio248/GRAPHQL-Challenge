import { Exclude, Expose, Type } from 'class-transformer';
import { Cart, Order, Role } from '@prisma/client';
import { CartEntity } from '../../../cart/entities';

export class UserResponse {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  role: Role;

  @Exclude()
  accessToken: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string;

  @Expose()
  @Type(() => CartEntity)
  cart: Cart;

  @Exclude()
  orders: Order[];
}
