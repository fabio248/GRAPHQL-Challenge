import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '../database/database.module';
import { PrismaUserRepository } from './prisma.user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    { provide: 'UserRepository', useClass: PrismaUserRepository },
    UserService,
  ],
  exports: [
    UserService,
    { provide: 'UserRepository', useClass: PrismaUserRepository },
  ],
})
export class UsersModule {}
