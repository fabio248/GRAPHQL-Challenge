import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';
import { GenericRepository } from 'src/shared/repository.interface';
import { Prisma, Product } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ProductResponse } from './dto/response/product.dto';

@Injectable()
export class ProductsService {
  private PRODUCT_IS_ENABLE = true;
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: GenericRepository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductResponse> {
    const product: Product = await this.productRepository.create({
      ...createProductDto,
      price: +createProductDto.price,
    });
    return plainToInstance(ProductResponse, product);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProductWhereInput;
  }) {
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
