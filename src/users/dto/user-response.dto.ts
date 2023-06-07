import { Exclude } from 'class-transformer';

export class UserDto {
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  password: string;
}
