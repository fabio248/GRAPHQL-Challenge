import { Inject, Injectable } from '@nestjs/common';
import { UpdateCartInput } from '../dto/input/update-cart.input';
import { GenericRepository } from '../../shared/repository.interface';
import { Cart } from '@prisma/client';
import { UserService } from '../../users/users.service';
import { CartEntity } from '../entities/car.entity';
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

  async create(userId: number): Promise<CartEntity> {
    await this.userService.findOneById(userId);
    const isUserHaveAlreadyCar = await this.cartRepository.findOne({ userId });

    if (isUserHaveAlreadyCar) {
      throw new UserAlreadyHaveCartException();
    }

    const car = await this.cartRepository.create({ userId });

    return plainToInstance(CartEntity, car);
  }

  async findAll(skip?: number, take?: number) {
    return this.cartRepository.findAll({ skip, take });
  }

  async findOneById(cartId: number): Promise<CartEntity> {
    const cart = await this.cartRepository.findOne({ id: cartId });

    if (!cart) {
      throw new CartNotFoundException();
    }

    return plainToInstance(CartEntity, cart);
  }

  async findOneByUserId(userId: number) {
    const cart = await this.cartRepository.findOne({ userId });

    if (!cart) {
      const newCart = await this.cartRepository.create({ userId });

      return plainToInstance(CartEntity, newCart);
    }

    return plainToInstance(CartEntity, cart);
  }

  async update(id: number, updateCartDto: UpdateCartInput) {
    await this.findOneById(id);

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

  async decreaseTotalAmount(cart: CartEntity, subtotal: number) {
    const newTotal = cart.total - subtotal;

    await this.update(cart.id, { total: newTotal });
  }

  async replaceTotalAmount(cart: CartEntity, subtotal: number) {
    await this.update(cart.id, { total: subtotal });
  }
}
