import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsResolver } from './products.resolver';
import PrismaProductRepository from './prisma.product.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: 'ProductRepository', useClass: PrismaProductRepository },
    ProductsService,
    ProductsResolver,
  ],
  exports: [
    ProductsService,
    { provide: 'ProductRepository', useClass: PrismaProductRepository },
  ],
})
export class ProductsModule {}
