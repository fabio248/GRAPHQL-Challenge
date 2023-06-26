import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER',
}

registerEnumType(Role, { name: 'Role' });
