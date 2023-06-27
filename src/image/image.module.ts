import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { DatabaseModule } from '../database/database.module';
import { ImageController } from './image.controller';
import PrismaImageRepository from './image.repository';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';
import { ImageResolver } from './image.resolver';

@Module({
  imports: [DatabaseModule, ProductsModule],
  providers: [
    { provide: 'ImageRepository', useClass: PrismaImageRepository },
    ImageService,
    ProductsService,
    ImageResolver,
  ],
  controllers: [ImageController],
})
export class ImageModule {}
