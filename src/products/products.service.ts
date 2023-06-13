import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { GenericRepository } from 'src/shared/repository.interface';
import { Prisma, Product } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ProductResponse } from './dto/response/product.dto';
import ProductNotFoundException from './exceptions/product-not-found.expection';

@Injectable()
export class ProductsService {
  private PRODUCT_IS_ENABLE = true;
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: GenericRepository<Product>,
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
  }): Promise<ProductResponse[]> {
    const { skip, take, disabledProduct, categoryId } = params;
    const where: Prisma.ProductWhereInput = {};
    where.OR = [{ isEnable: true }];

    if (categoryId) {
      where.AND = { categoryId };
    }

    if (disabledProduct) {
      where.OR.push({ isEnable: false });
    }

    const listProduct: Product[] = await this.productRepository.findAll({
      skip,
      take,
      where,
    });

    return listProduct.map((product) =>
      plainToInstance(ProductResponse, product),
    );
  }

  async findOneById(id: number): Promise<ProductResponse> {
    const product: Product | null = await this.productRepository.findOne({
      id,
    });

    if (!product) {
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
}
