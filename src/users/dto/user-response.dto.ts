import { Exclude, Expose } from 'class-transformer';
import { Role } from './create-user.dto';

export class UserDto {
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
