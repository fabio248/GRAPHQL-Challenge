import { Inject, Injectable } from '@nestjs/common';
import { UpdateCartDto } from '../dto/request/update-cart.dto';
import { GenericRepository } from '../../shared/repository.interface';
import { Cart } from '@prisma/client';
import { UserService } from '../../users/users.service';
import CartResponse from '../dto/response/car-response.dto';
import { plainToInstance } from 'class-transformer';
import CartNotFoundException from '../expections/cart-not-found.exception';
import UserAlreadyHaveCartException from '../expections/user-already-have-cart.exception';

@Injectable()
export class CartService {
  constructor(
    @Inject('CartRepository')
    private readonly cartRepository: GenericRepository<Cart>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number): Promise<CartResponse> {
    await this.userService.findOneById(userId);
    const isUserHaveAlreadyCar = await this.findOneByUserIdWithOutError(userId);

    if (isUserHaveAlreadyCar) {
      throw new UserAlreadyHaveCartException();
    }

    const car = this.cartRepository.create({ userId });

    return plainToInstance(CartResponse, car);
  }

  findAll(skip?: number, take?: number) {
    return this.cartRepository.findAll({ skip, take });
  }

  async findOneById(cartId: number): Promise<CartResponse> {
    const cart = await this.cartRepository.findOne({ id: cartId });

    if (!cart) {
      throw new CartNotFoundException();
    }

    return plainToInstance(CartResponse, cart);
  }

  async findOneByUserId(userId: number) {
    const cart = await this.cartRepository.findOne({ userId });

    if (!cart) {
      return this.create(userId);
    }

    return plainToInstance(CartResponse, cart);
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return this.cartRepository.update({ where: { id }, data: updateCartDto });
  }

  async updateTotalAmount(cartId: number) {
    let newTotal = 0;
    const { products } = await this.findOneById(cartId);

    products.forEach((product) => {
      newTotal += product.subtotal;
    });

    await this.update(cartId, { total: newTotal });
  }

  async decreaseTotalAmount(cart: CartResponse, subtotal: number) {
    const newTotal = cart.total - subtotal;

    await this.update(cart.id, { total: newTotal });
  }

  private async findOneByUserIdWithOutError(
    userId: number,
  ): Promise<Cart | null> {
    return this.cartRepository.findOne({ userId });
  }

  async replaceTotalAmount(cart: CartResponse, subtotal: number) {
    await this.update(cart.id, { total: subtotal });
  }
}
