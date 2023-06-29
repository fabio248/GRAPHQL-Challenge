import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsResolver } from './products.resolver';
import PrismaProductRepository from './prisma.product.repository';
import { CategoryModule } from '../category/category.module';
import { ImageModule } from '../image/image.module';
import { MailerModule } from '../mailer/mailer.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    DatabaseModule,
    CategoryModule,
    MailerModule,
    UsersModule,
    forwardRef(() => ImageModule),
  ],
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
