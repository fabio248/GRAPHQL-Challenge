import { Inject, Injectable } from '@nestjs/common';
import { GenericRepository } from '../../shared/repository.interface';
import { ProductInCar } from '@prisma/client';
import { CreateProductInCarInput } from '../dto/input/create-product-in-cat';
import { CartService } from './cart.service';
import { ProductsService } from '../../products/products.service';
import { plainToInstance } from 'class-transformer';
import { ProductInCarEntity } from '../entities';
import NoEnoughStockException from '../expections/no-enough-stock.exception';
import ProductInCarNotFoundException from '../expections/product-in-cart-not-found.exception';
import { ProductEntity } from '../../products/entities';
import { RemoveProductInCartInput } from '../dto/input';

@Injectable()
export default class ProductInCartService {
  constructor(
    @Inject('ProductInCarRepository')
    private readonly productInCartRepository: GenericRepository<ProductInCar>,
    private readonly cartService: CartService,
    private readonly productService: ProductsService,
  ) {}

  async create(data: CreateProductInCarInput, userId: number) {
    const cart = await this.cartService.findOneByUserId(userId);
    const product: ProductEntity = await this.productService.findOneById(
      data.productId,
    );

    await this.productService.checkEnoughStock(product.id, data.quantity);

    const alreadyExitsProducInCar = await this.isProductAlreadyAddedCart(
      cart.id,
      product.id,
    );

    if (alreadyExitsProducInCar) {
      return this.add(alreadyExitsProducInCar, data.quantity, product);
    }

    const subtotal = data.quantity * product.price;

    const newProductInCart = this.productInCartRepository.create({
      ...data,
      subtotal,
      cartId: cart.id,
    });

    this.cartService.updateTotalAmount(cart.id);

    return newProductInCart;
  }

  private async add(
    productInCar: ProductInCar,
    quantity: number,
    product: ProductEntity,
  ): Promise<ProductInCar> {
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

    return updatedProductInCar;
  }

  async findAll(): Promise<ProductInCarEntity[]> {
    const listProductInCart = await this.productInCartRepository.findAll({});

    return listProductInCart.map((product) => {
      return plainToInstance(ProductInCarEntity, product);
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

  async remove(
    userId: number,
    removeProductInCartInput: RemoveProductInCartInput,
  ) {
    const { productId } = removeProductInCartInput;
    const cart = await this.cartService.findOneByUserId(userId);

    //Check if the product in cart exists
    await this.findOneById(cart.id, productId);

    const productInCar = await this.productInCartRepository.delete({
      cartId_productId: { cartId: cart.id, productId },
    });

    await this.cartService.decreaseTotalAmount(cart, productInCar.subtotal);

    return plainToInstance(ProductInCarEntity, productInCar);
  }

  private async isProductAlreadyAddedCart(cartId: number, productId: number) {
    return this.productInCartRepository.findOne({
      cartId_productId: { cartId, productId },
    });
  }
}
