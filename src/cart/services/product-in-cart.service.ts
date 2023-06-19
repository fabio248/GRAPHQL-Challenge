import { Inject, Injectable } from '@nestjs/common';
import { GenericRepository } from '../../shared/repository.interface';
import { ProductInCar } from '@prisma/client';
import CreateProductInCarDto from '../dto/request/create-product-in-cat';
import { CartService } from './cart.service';
import { ProductsService } from '../../products/products.service';
import { plainToInstance } from 'class-transformer';
import ProductInCarResponse from '../dto/response/products-in-car.dto';
import NoEnoughStockException from '../expections/no-enough-stock.exception';
import ProductInCarNotFoundException from '../expections/product-in-cart-not-found.exception';
import { ProductResponse } from '../../products/dto/response/product.dto';

@Injectable()
export default class ProductInCartService {
  constructor(
    @Inject('ProductInCarRepository')
    private readonly productInCartRepository: GenericRepository<ProductInCar>,
    private readonly cartService: CartService,
    private readonly productService: ProductsService,
  ) {}

  async create(data: CreateProductInCarDto, cartId: number) {
    await this.cartService.findOneById(cartId);
    const product: ProductResponse = await this.productService.findOneById(
      data.productId,
    );

    await this.productService.checkEnoughStock(product.id, data.quantity);

    const producInCar = await this.isProductAlreadyAddedCart(
      cartId,
      product.id,
    );

    if (producInCar) {
      return await this.add(producInCar, data.quantity, product);
    }

    const subtotal = data.quantity * product.price;

    const producInCart = await this.productInCartRepository.create({
      ...data,
      subtotal,
      cartId,
    });

    await this.cartService.updateTotalAmount(cartId);

    return plainToInstance(ProductInCarResponse, producInCart);
  }

  async add(
    productInCar: ProductInCar,
    quantity: number,
    product: ProductResponse,
  ): Promise<ProductInCarResponse> {
    const newQuantity = productInCar.quantity + quantity;
    const newsubTotal = productInCar.subtotal + quantity * product.price;

    if (product.stock < newQuantity) {
      throw new NoEnoughStockException(product.id);
    }

    const updatedProductInCar = await this.productInCartRepository.update({
      where: {
        cartId_productId: {
          cartId: productInCar.cartId,
          productId: productInCar.productId,
        },
      },
      data: { quantity: newQuantity, subtotal: newsubTotal },
    });

    await this.cartService.updateTotalAmount(productInCar.cartId);

    return plainToInstance(ProductInCarResponse, updatedProductInCar);
  }

  async findAll(): Promise<ProductInCarResponse[]> {
    const listProductInCart = await this.productInCartRepository.findAll({});

    return listProductInCart.map((product) => {
      return plainToInstance(ProductInCarResponse, product);
    });
  }

  async findOneById(cartId: number, productId: number) {
    const productInCar = await this.productInCartRepository.findOne({
      cartId_productId: { cartId, productId },
    });

    if (!productInCar) {
      throw new ProductInCarNotFoundException();
    }

    return productInCar;
  }

  async remove(cartId: number, productId: number) {
    const cart = await this.cartService.findOneById(cartId);

    //Check if the product in cart exists
    await this.findOneById(cartId, productId);

    const productInCar = await this.productInCartRepository.delete({
      cartId_productId: { cartId, productId },
    });

    await this.cartService.decreaseTotalAmount(cart, productInCar.subtotal);

    return plainToInstance(ProductInCarResponse, productInCar);
  }

  private async isProductAlreadyAddedCart(cartId: number, productId: number) {
    return this.productInCartRepository.findOne({
      cartId_productId: { cartId, productId },
    });
  }
}
