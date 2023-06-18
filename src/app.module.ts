import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PrismaService } from './database/prisma.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './category/category.module';
import { ImageModule } from './image/image.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    CatalogModule,
    ImageModule,
    CartModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
