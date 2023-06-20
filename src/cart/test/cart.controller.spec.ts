import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../services/cart.service';
import ProductInCartService from '../services/product-in-cart.service';
import { createMockCartService } from '../../shared/mocks/cart/cart.service.mock';
import { createMockProductService } from '../../shared/mocks/product/product.service.mock';

describe('CartController', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        { provide: CartService, useFactory: createMockCartService },
        { provide: ProductInCartService, useFactory: createMockProductService },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
