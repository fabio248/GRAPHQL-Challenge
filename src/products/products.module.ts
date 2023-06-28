import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsResolver } from './products.resolver';
import PrismaProductRepository from './prisma.product.repository';
import { CategoryModule } from '../category/category.module';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [DatabaseModule, CategoryModule, forwardRef(() => ImageModule)],
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
