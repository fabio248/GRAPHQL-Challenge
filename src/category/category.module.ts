import { Module } from '@nestjs/common';
import { CatalogService } from './category.service';
import { CatalogController } from './category.controller';
import { DatabaseModule } from 'src/database/database.module';
import PrismaCatalogRepository from './prisma.catalog.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CatalogController],
  providers: [
    { provide: 'CatalogRepository', useClass: PrismaCatalogRepository },
    CatalogService,
  ],
})
export class CatalogModule {}
