import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { GenericRepository } from 'src/shared/repository.interface';
import { Prisma, Product } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ProductResponse } from './dto/response/product.dto';
import ProductNotFound from './exceptions/product-not-found.expection';

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
    where?: Prisma.ProductWhereInput;
  }): Promise<ProductResponse[]> {
    const { skip, take, where } = params;

    const listProduct: Product[] = await this.productRepository.findAll({
      skip,
      take,
      where,
    });

    return listProduct.map((product) =>
      plainToInstance(ProductResponse, product),
    );
  }

  async findOne(id: number): Promise<ProductResponse> {
    const product: Product | null = await this.productRepository.findOne({
      id,
    });

    if (!product) {
      throw new ProductNotFound();
    }

    return plainToInstance(ProductResponse, product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponse> {
    await this.findOne(id);

    const product = this.productRepository.update({
      where: { id },
      data: updateProductDto,
    });

    return plainToInstance(ProductResponse, product);
  }

  async remove(id: number): Promise<Product> {
    await this.findOne(id);
    return await this.productRepository.delete({ id });
  }
}
