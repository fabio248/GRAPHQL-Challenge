import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../services/cart.service';
import {
  MockContextCartRepo,
  createMockCartRepo,
} from '../../shared/mocks/cart/cart.repository.mock';
import {
  MockContextUserService,
  createMockUserService,
} from '../../shared/mocks/users/user.service.mock';
import { UserService } from '../../users/users.service';
import { buildCart, buildUser, getId, getPrice } from '../../shared/generate';
import { Cart } from '@prisma/client';
import UserAlreadyHaveCartException from '../expections/user-already-have-cart.exception';
import { UserResponse } from '../../users/dto/response/user-response.dto';
import CartNotFoundException from '../expections/cart-not-found.exception';
import { CartEntity } from '../entities/car.entity';

describe('CartService', () => {
  let service: CartService;
  let mockCartRepo: MockContextCartRepo;
  let mockUserService: MockContextUserService;
  const user = buildUser() as unknown as UserResponse;
  const cart = buildCart({
    productId: undefined,
  }) as unknown as Cart;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'CartRepository', useFactory: createMockCartRepo },
        { provide: UserService, useFactory: createMockUserService },
        CartService,
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    mockCartRepo = module.get<MockContextCartRepo>('CartRepository');
    mockUserService = module.get<MockContextUserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = getId;
    it('thrwon an error when cart already exists', async () => {
      mockUserService.findOneById.mockResolvedValueOnce(user);
      mockCartRepo.findOne.mockResolvedValue(cart);

      await expect(service.create(userId)).rejects.toEqual(
        new UserAlreadyHaveCartException(),
      );

      expect(mockCartRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOneById).toHaveBeenCalledTimes(1);
      expect(mockCartRepo.create).not.toHaveBeenCalled();
    });

    it('should create a new cart', async () => {
      mockUserService.findOneById.mockResolvedValueOnce(user);
      mockCartRepo.findOne.mockResolvedValue(null);
      mockCartRepo.create.mockResolvedValueOnce(cart);

      const actual = await service.create(userId);

      expect(actual).toEqual(cart);
      expect(mockCartRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserService.findOneById).toHaveBeenCalledTimes(1);
      expect(mockCartRepo.create).toHaveBeenCalledTimes(1);
    });
  });
  describe('findAll', () => {
    it('shoudl return a list of carts', async () => {
      const listCart = [cart, cart, cart];
      mockCartRepo.findAll.mockResolvedValue(listCart);

      const actual = await service.findAll();

      expect(actual).toHaveLength(listCart.length);
      expect(mockCartRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should return a car search by id', async () => {
      mockCartRepo.findOne.mockResolvedValueOnce(cart);

      const actual = await service.findOneById(cart.id);

      expect(actual).toEqual(cart);
      expect(mockCartRepo.findOne).toHaveBeenCalledTimes(1);
    });

    it('throw an error when cart does not exists', async () => {
      mockCartRepo.findOne.mockResolvedValueOnce(null);

      const actual = () => service.findOneById(cart.id);

      expect(actual).rejects.toEqual(new CartNotFoundException());
      expect(mockCartRepo.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    const updatedCart = { ...cart, total: getPrice() } as unknown as Cart;
    it('should update a cart', async () => {
      mockCartRepo.findOne.mockResolvedValueOnce(cart);
      mockCartRepo.update.mockResolvedValueOnce(updatedCart);

      const actual = await service.update(cart.id, updatedCart);

      expect(actual).toEqual(updatedCart);
      expect(mockCartRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockCartRepo.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateTotalAmount', () => {
    const updatedCart = { ...cart, total: getPrice() } as unknown as Cart;
    it('should update amount of cart', async () => {
      mockCartRepo.findOne.mockResolvedValue(cart);
      mockCartRepo.update.mockResolvedValue(updatedCart);

      await service.updateTotalAmount(cart.id);

      expect(mockCartRepo.findOne).toHaveBeenCalled();
      expect(mockCartRepo.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByUserId', () => {
    const userId = getId;
    it('should return an exits cart searched by user id', async () => {
      mockCartRepo.findOne.mockResolvedValueOnce(cart);

      const actual = await service.findOneByUserId(userId);

      expect(actual).toEqual(cart);
      expect(mockCartRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockCartRepo.create).not.toHaveBeenCalled();
    });

    it('should create a cart if user does not already have one', async () => {
      mockCartRepo.findOne.mockResolvedValue(null);
      mockCartRepo.create.mockResolvedValueOnce(cart);

      const actual = await service.findOneByUserId(userId);

      expect(actual).toEqual(cart);
      expect(mockCartRepo.findOne).toHaveBeenCalled();
      expect(mockCartRepo.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('decreaseTotalAmount', () => {
    const newTotal = getPrice();
    const updatedCart = { ...cart, total: newTotal } as unknown as Cart;
    it('should decrease amount of cart', async () => {
      mockCartRepo.findOne.mockResolvedValue(cart);
      mockCartRepo.update.mockResolvedValueOnce(updatedCart);

      await service.decreaseTotalAmount(
        cart as unknown as CartEntity,
        +newTotal,
      );

      expect(mockCartRepo.update).toHaveBeenCalled();
    });
  });

  describe('replaceTotalAmount', () => {
    const newTotal = getPrice();
    const updatedCart = { ...cart, total: newTotal } as unknown as Cart;
    it('should decrease amount of cart', async () => {
      mockCartRepo.findOne.mockResolvedValue(cart);
      mockCartRepo.update.mockResolvedValueOnce(updatedCart);

      await service.decreaseTotalAmount(
        cart as unknown as CartEntity,
        +newTotal,
      );

      expect(mockCartRepo.update).toHaveBeenCalled();
    });
  });
});
