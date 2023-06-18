import { Exclude, Expose } from 'class-transformer';
import { Role } from '../request/create-user.dto';
import { Cart } from '@prisma/client';

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
  cart: Cart;
}
