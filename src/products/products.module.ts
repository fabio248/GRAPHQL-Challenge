import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/database/database.module';
import PrismaProductRepository from './prisma.product.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [
    { provide: 'ProductRepository', useClass: PrismaProductRepository },
    ProductsService,
  ],
})
export class ProductsModule {}
