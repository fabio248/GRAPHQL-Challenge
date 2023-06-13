import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CatalogController } from './category.controller';
import { DatabaseModule } from 'src/database/database.module';
import PrismaCatalogRepository from './prisma.category.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CatalogController],
  providers: [
    { provide: 'CatalogRepository', useClass: PrismaCatalogRepository },
    CategoryService,
  ],
})
export class CatalogModule {}
