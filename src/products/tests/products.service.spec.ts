import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import {
  MockContextProductRepo,
  createMockProductRepo,
} from '../../shared/mocks/product/product.repository.mock';
import { buildProduct, getDescription, getId } from '../../shared/generate';
import { Product, UserLikeProduct } from '@prisma/client';
import { CreateProductDto } from '../dto/request/create-product.dto';
import { UpdateProductDto } from '../dto/request/update-product.dto';
import ProductNotFoundException from '../exceptions/product-not-found.expection';
import NoEnoughStockException from '../../cart/expections/no-enough-stock.exception';
import UserAlreadyLikeProductException from '../exceptions/user-already-liked-product.exception';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepository: MockContextProductRepo;
  const product = buildProduct({
    isEnable: true,
    category: undefined,
    id: undefined,
    images: undefined,
  }) as unknown as Product;

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
    const categoryId = getId;
    const disabledProduct = true;
    const notImages = true;
    it('should return a list of products', async () => {
      const listProduct = [product, product, product];
      mockRepository.findAll.mockResolvedValueOnce(listProduct);

      const actual = await service.findAll({
        categoryId,
        disabledProduct,
        notImages,
      });

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

    describe('checkEnoughStock', () => {
      const productId = getId;
      const quantity = Number.MAX_VALUE;
      const product = buildProduct({ isEnable: true }) as unknown as Product;
      it('throw an error when stock is not enough', async () => {
        mockRepository.findOne.mockResolvedValue(product);

        const actual = () => service.checkEnoughStock(productId, quantity);

        expect(actual).rejects.toEqual(new NoEnoughStockException(productId));
        expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      });
    });

    describe('createLike', () => {
      const userLikeProduct = {
        userId: getId,
        productId: getId,
      } as UserLikeProduct;
      it('should create a like on product', async () => {
        mockRepository.findLike.mockResolvedValueOnce(null);
        mockRepository.createLike.mockResolvedValueOnce(userLikeProduct);

        const actual = await service.createLike(
          userLikeProduct.userId,
          userLikeProduct.productId,
        );

        expect(actual).toEqual(userLikeProduct);
        expect(mockRepository.findLike).toHaveBeenCalledTimes(1);
        expect(mockRepository.createLike).toHaveBeenCalledTimes(1);
      });

      it('throw an error when user already liked the product', async () => {
        mockRepository.findLike.mockResolvedValueOnce(
          userLikeProduct as UserLikeProduct,
        );

        const actual = () =>
          service.createLike(userLikeProduct.userId, userLikeProduct.productId);

        expect(actual).rejects.toEqual(new UserAlreadyLikeProductException());
        expect(mockRepository.findLike).toHaveBeenCalledTimes(1);
      });
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
