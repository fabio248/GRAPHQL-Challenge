import { Test, TestingModule } from '@nestjs/testing';
import {
  MockContextCartService,
  createMockCartService,
} from '../../shared/mocks/cart/cart.service.mock';
import { CartService } from '../services/cart.service';
import { ProductsService } from '../../products/products.service';
import {
  MockContextProductService,
  createMockProductService,
} from '../../shared/mocks/product/product.service.mock';
import ProductInCartService from '../services/product-in-cart.service';
import {
  MockContextProductInCartRepo,
  createMockProductInCartRepo,
} from '../../shared/mocks/cart/product-in-car.repository.mock';
import {
  buildCart,
  buildProduct,
  buildProductInCart,
  getId,
} from '../../shared/generate';
import { CartEntity } from '../entities/car.entity';
import { CreateProductInCarInput } from '../dto/input';
import { ProductInCar } from '@prisma/client';
import { ProductEntity } from '../../products/entities';

describe('ProductInCartService', () => {
  let service: ProductInCartService;
  let mockProductInCarRepo: MockContextProductInCartRepo;
  let mockProductService: MockContextProductService;
  let mockCartService: MockContextCartService;
  const cart = buildCart({ id: getId }) as unknown as CartEntity;
  const product = buildProduct() as unknown as ProductEntity;
  const productInCart = buildProductInCart() as unknown as ProductInCar;
  const createProductInCart =
    buildProductInCart() as unknown as CreateProductInCarInput;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ProductInCarRepository',
          useFactory: createMockProductInCartRepo,
        },
        { provide: CartService, useFactory: createMockCartService },
        { provide: ProductsService, useFactory: createMockProductService },
        { provide: CartService, useFactory: createMockCartService },
        ProductInCartService,
      ],
    }).compile();

    service = module.get<ProductInCartService>(ProductInCartService);
    mockProductInCarRepo = module.get<MockContextProductInCartRepo>(
      'ProductInCarRepository',
    );
    mockProductService = module.get<MockContextProductService>(ProductsService);
    mockCartService = module.get<MockContextCartService>(CartService);
  });
  describe('create', () => {
    const cartId = getId;
    it('should create a product in car', async () => {
      mockCartService.findOneByUserId.mockResolvedValueOnce(cart);
      mockProductService.findOneById.mockResolvedValueOnce(product);
      mockProductService.checkEnoughStock.mockResolvedValueOnce();
      mockProductInCarRepo.findOne.mockResolvedValueOnce(null);
      mockProductInCarRepo.create.mockResolvedValueOnce(productInCart);

      const actual = await service.create(createProductInCart, cartId);

      expect(actual).toEqual(productInCart);
    });
  });

  describe('findAll', () => {
    it('should return a list of products in car', async () => {
      const listProductsInCar = [productInCart, productInCart, productInCart];
      mockProductInCarRepo.findAll.mockResolvedValueOnce(listProductsInCar);

      const actual = await service.findAll();

      expect(actual).toHaveLength(listProductsInCar.length);
      expect(mockProductInCarRepo.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneById', () => {
    it('should return a product in cart', async () => {
      mockProductInCarRepo.findOne.mockResolvedValueOnce(productInCart);

      const actual = await service.findOneById(
        productInCart.cartId,
        productInCart.productId,
      );

      expect(actual).toEqual(productInCart);
      expect(mockProductInCarRepo.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove product from cart', async () => {
      mockCartService.findOneByUserId.mockResolvedValue(cart);
      mockProductInCarRepo.findOne.mockResolvedValueOnce(productInCart);
      mockProductInCarRepo.delete.mockResolvedValueOnce(productInCart);
      mockCartService.decreaseTotalAmount.mockResolvedValueOnce();

      const actual = await service.remove(productInCart.cartId, {
        productId: productInCart.productId,
      });

      expect(actual).toEqual(productInCart);
      expect(mockCartService.findOneByUserId).toHaveBeenCalledTimes(1);
      expect(mockProductInCarRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockProductInCarRepo.delete).toHaveBeenCalledTimes(1);
      expect(mockCartService.decreaseTotalAmount).toHaveBeenCalledTimes(1);
    });
  });
});
