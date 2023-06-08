import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaUserRepository } from './prisma.user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    { provide: 'UserRepository', useClass: PrismaUserRepository },
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
