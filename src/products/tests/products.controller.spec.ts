import { ProductsService } from '../products.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import {
  MockContextProductService,
  createMockProductService,
} from '../../shared/mocks/product/product.service.mock';
import { buildProduct, buildRes, getDescription } from '../../shared/generate';
import { ProductResponse } from '../dto/response/product.dto';
import { CreateProductDto } from '../dto/request/create-product.dto';
import DeleteMessageProduct from '../message-response/delete-message.response';

describe('ProductsController', () => {
  let controller: ProductsController;
  let mockService: MockContextProductService;
  const product = buildProduct() as unknown as ProductResponse;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: ProductsService, useFactory: createMockProductService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    mockService = module.get<MockContextProductService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      mockService.create.mockReturnValueOnce(product);

      const actual = controller.create(product as unknown as CreateProductDto);

      expect(actual).toEqual(product);
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const listProduct = [product, product, product];
      mockService.findAll.mockResolvedValueOnce(listProduct);

      const actual = await controller.findAll();

      expect(actual).toHaveLength(listProduct.length);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
      expect(actual[0]).toEqual(product);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockService.findOneById.mockResolvedValueOnce(product);

      const actual = await controller.findOne(`${product.id}`);

      expect(actual).toEqual(product);
      expect(mockService.findOneById).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a product by id', async () => {
      product.description = getDescription();
      mockService.update.mockResolvedValueOnce(product);

      const actual = await controller.update(`${product.id}`, {
        description: product.description,
      });

      expect(actual).toEqual(product);
      expect(mockService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    const res = buildRes();
    it('should delete user', async () => {
      mockService.remove.mockResolvedValueOnce(product);

      await controller.remove(res, `${product.id}`);

      expect(res.send).toHaveBeenCalledWith(
        new DeleteMessageProduct(product.id),
      );
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(mockService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
