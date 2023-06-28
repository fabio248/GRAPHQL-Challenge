import { Module, forwardRef } from '@nestjs/common';
import { ImageService } from './image.service';
import { DatabaseModule } from '../database/database.module';
import PrismaImageRepository from './image.repository';

import { ProductsModule } from '../products/products.module';
import { ImageResolver } from './image.resolver';

@Module({
  imports: [DatabaseModule, forwardRef(() => ProductsModule)],
  providers: [
    { provide: 'ImageRepository', useClass: PrismaImageRepository },
    ImageService,
    ImageResolver,
  ],
  exports: [ImageService],
})
export class ImageModule {}
