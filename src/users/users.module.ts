import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { DatabaseModule } from '../database/database.module';
import { PrismaUserRepository } from './prisma.user.repository';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: 'UserRepository', useClass: PrismaUserRepository },
    UserService,
    UsersResolver,
  ],
  exports: [
    UserService,
    { provide: 'UserRepository', useClass: PrismaUserRepository },
  ],
})
export class UsersModule {}
