import { Inject, Injectable } from '@nestjs/common';
import { UpdateProductInput, CreateProductInput } from './dto/inputs';
import { ProductRepository } from 'src/shared/repository.interface';
import { Prisma, Product, UserLikeProduct } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from './entities';
import ProductNotFoundException from './exceptions/product-not-found.expection';
import NoEnoughStockException from '../cart/expections/no-enough-stock.exception';

@Injectable()
export class ProductsService {
  private PRODUCT_IS_ENABLE = true;

  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
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
    const userLikeProduct = await this.productRepository.findLike(
      userId,
      productId,
    );
    let query;
    let type;

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
}
