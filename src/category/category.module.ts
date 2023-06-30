import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryResolver } from './category.resolver';
import PrismaCatalogRepository from './prisma.category.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    { provide: 'CatalogRepository', useClass: PrismaCatalogRepository },
    CategoryService,
    CategoryResolver,
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
