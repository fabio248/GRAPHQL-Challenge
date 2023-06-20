import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { ProductRepository } from 'src/shared/repository.interface';
import { Prisma, Product } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ProductResponse } from './dto/response/product.dto';
import ProductNotFoundException from './exceptions/product-not-found.expection';
import NoEnoughStockException from '../cart/expections/no-enough-stock.exception';
import UserAlreadyHaveCartException from '../cart/expections/user-already-have-cart.exception';
import UserAlreadyLikeProductException from './exceptions/user-already-liked-product.exception';

@Injectable()
export class ProductsService {
  private PRODUCT_IS_ENABLE = true;
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  create(createProductDto: CreateProductDto): ProductResponse {
    const product = this.productRepository.create({
      ...createProductDto,
      price: +createProductDto.price,
    });
    return plainToInstance(ProductResponse, product);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    disabledProduct?: boolean;
    categoryId?: number;
    notImages?: boolean;
  }): Promise<ProductResponse[]> {
    const { skip, take, disabledProduct, categoryId, notImages } = params;

    const where: Prisma.ProductWhereInput = {};
    where.OR = [{ isEnable: true }];

    const include: Prisma.ProductInclude = {};
    include.images = true;

    if (categoryId) {
      where.AND = { categoryId };
    }

    if (disabledProduct) {
      where.OR.push({ isEnable: false });
    }

    if (notImages) {
      include.images = false;
    }

    const listProduct: Product[] = await this.productRepository.findAll({
      skip,
      take,
      where,
      include,
    });

    return listProduct.map((product) =>
      plainToInstance(ProductResponse, product),
    );
  }

  async findOneById(id: number): Promise<ProductResponse> {
    const product: Product | null = await this.productRepository.findOne({
      id,
    });

    if (!product || product.isEnable !== this.PRODUCT_IS_ENABLE) {
      throw new ProductNotFoundException();
    }

    return plainToInstance(ProductResponse, product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponse> {
    await this.findOneById(id);

    const product = this.productRepository.update({
      where: { id },
      data: updateProductDto,
    });

    return plainToInstance(ProductResponse, product);
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

    if (userLikeProduct) {
      throw new UserAlreadyLikeProductException();
    }

    return this.productRepository.createLike({ userId, productId });
  }
}
