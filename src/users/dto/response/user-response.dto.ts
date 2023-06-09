import { Exclude, Expose } from 'class-transformer';
import { Role } from '../request/create-user.dto';

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
}
