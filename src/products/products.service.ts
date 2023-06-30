import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UpdateProductInput, CreateProductInput } from './dto/inputs';
import { ProductRepository } from 'src/shared/repository.interface';
import { Prisma, Product } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from './entities';
import ProductNotFoundException from './exceptions/product-not-found.expection';
import NoEnoughStockException from '../cart/expections/no-enough-stock.exception';
import { MailerService } from '../mailer/mailer.service';
import { getNotifyLowStockMail } from './utils/notify-low-stock.mail';
import { UserService } from '../users/users.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class ProductsService {
  private PRODUCT_IS_ENABLE = true;

  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async create(createProductInput: CreateProductInput): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductInput,
      price: +createProductInput.price,
    });

    return product;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    embedDisabledProducts?: boolean;
    categoryId?: number;
  }): Promise<Product[]> {
    const { skip, take, embedDisabledProducts, categoryId } = params;

    const where: Prisma.ProductWhereInput = {};
    where.OR = [{ isEnable: true }];

    if (categoryId) {
      where.AND = { categoryId };
    }

    if (embedDisabledProducts) {
      where.OR.push({ isEnable: false });
    }

    const listProduct: Product[] = await this.productRepository.findAll({
      skip,
      take,
      where,
    });

    return listProduct;
  }

  async findOneById(id: number): Promise<ProductEntity> {
    const product: Product | null = await this.productRepository.findOne({
      id,
    });

    if (!product || product.isEnable !== this.PRODUCT_IS_ENABLE) {
      throw new ProductNotFoundException();
    }

    return plainToInstance(ProductEntity, product);
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    await this.findOneById(id);

    const product = this.productRepository.update({
      where: { id },
      data: updateProductInput,
    });

    return product;
  }

  async changeProductStatus(productId: number) {
    const product = await this.productRepository.findOne({ id: productId });
    const data = { isEnable: this.PRODUCT_IS_ENABLE };

    if (!product) {
      throw new ProductNotFoundException();
    }
    product.isEnable === this.PRODUCT_IS_ENABLE
      ? (data.isEnable = false)
      : null;

    return this.productRepository.update({ where: { id: productId }, data });
  }

  async remove(id: number): Promise<Product> {
    await this.findOneById(id);
    return await this.productRepository.delete({ id });
  }

  async checkEnoughStock(producId: number, quantity: number) {
    const product = await this.findOneById(producId);

    if (product.stock < quantity) {
      throw new NoEnoughStockException(producId);
    }
  }

  async createLike(userId: number, productId: number) {
    let query;
    let type;

    await this.findOneById(productId);

    const userLikeProduct = await this.productRepository.findLike(
      userId,
      productId,
    );

    if (userLikeProduct) {
      query = await this.productRepository.deleteLike({
        userId_productId: { userId, productId },
      });
      type = 'unliked';
    } else {
      query = await this.productRepository.createLike({ userId, productId });
      type = 'like';
    }

    return { type, ...query };
  }

  async sendEmailLowStock(userId: number, productId: number): Promise<void> {
    const { username, email } = await this.userService.findOneById(userId);

    const images = await this.imageService.getImagesByProductId(productId);
    const { name: productName } = await this.findOneById(productId);

    const imagesUrl = [];

    for (const img of images) {
      imagesUrl.push(await img.url);
    }

    const mail = getNotifyLowStockMail(username, [
      { name: productName, url: imagesUrl },
    ]);

    this.mailerService.sendMail({
      to: email,
      subject: 'Low Stock Alert',
      html: mail,
    });
  }

  async checkStockLessThan3(productId: number) {
    const lastUserLikeProduct = await this.productRepository.findLastLike(
      productId,
    );

    if (!lastUserLikeProduct) {
      return null;
    }

    const { stock } = await this.findOneById(productId);

    if (stock <= 3) {
      this.sendEmailLowStock(lastUserLikeProduct.userId, productId);
    }
  }
}
