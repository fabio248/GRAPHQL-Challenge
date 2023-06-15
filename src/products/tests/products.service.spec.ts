import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import {
  MockContextProductRepo,
  createMockProductRepo,
} from '../../shared/mocks/product/product.repository.mock';
import { buildProduct, getDescription } from '../../shared/generate';
import { Product } from '@prisma/client';
import { CreateProductDto } from '../dto/request/create-product.dto';
import { UpdateProductDto } from '../dto/request/update-product.dto';
import ProductNotFoundException from '../exceptions/product-not-found.expection';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepository: MockContextProductRepo;
  const product = buildProduct() as unknown as Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: 'ProductRepository', useFactory: createMockProductRepo },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    mockRepository = module.get<MockContextProductRepo>('ProductRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      mockRepository.create.mockResolvedValueOnce(product);

      const actual = await service.create(
        product as unknown as CreateProductDto,
      );

      expect(actual).toEqual(product);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      const listProduct = [product, product, product];
      mockRepository.findAll.mockResolvedValueOnce(listProduct);

      const actual = await service.findAll({});

      expect(actual).toEqual(listProduct);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return an exists product', async () => {
      mockRepository.findOne.mockResolvedValueOnce(product);

      const actual = await service.findOneById(product.id);

      expect(actual).toEqual(product);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('throw an error when product does not exits', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      const actual = () => service.findOneById(product.id);

      expect(actual).rejects.toEqual(new ProductNotFoundException());
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('update', () => {
    it('should update an exists product by id', async () => {
      product.description = getDescription();
      mockRepository.findOne.mockResolvedValueOnce(product);
      mockRepository.update.mockResolvedValueOnce(product);

      const actual = await service.update(
        product.id,
        product as unknown as UpdateProductDto,
      );

      expect(actual).toEqual(product);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });

    it('throw an error when the product does not exits', async () => {
      product.description = getDescription();
      mockRepository.findOne.mockResolvedValueOnce(null);

      const actual = () =>
        service.update(product.id, product as unknown as UpdateProductDto);

      expect(actual).rejects.toEqual(new ProductNotFoundException());
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete an exist product', async () => {
      mockRepository.findOne.mockResolvedValueOnce(product);
      mockRepository.delete.mockResolvedValueOnce(product);

      const actual = await service.remove(product.id);

      expect(actual).toEqual(product);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
