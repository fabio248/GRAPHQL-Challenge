import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { PrismaService } from './database/prisma.service';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ImageModule } from './image/image.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { configuration } from './config';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    UsersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      introspection: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    CategoryModule,
    ImageModule,
    CartModule,
    OrdersModule,
    MailerModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
