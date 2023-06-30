import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import {
  MockContextProductRepo,
  createMockProductRepo,
} from '../../shared/mocks/product/product.repository.mock';
import {
  buildImage,
  buildProduct,
  buildUser,
  getDescription,
  getId,
  getUrl,
} from '../../shared/generate';
import { Product, User, UserLikeProduct } from '@prisma/client';
import { CreateProductInput } from '../dto/inputs/create-product.input';
import { UpdateProductInput } from '../dto/inputs/update-product.input';
import ProductNotFoundException from '../exceptions/product-not-found.expection';
import NoEnoughStockException from '../../cart/expections/no-enough-stock.exception';
import { UserService } from '../../users/users.service';
import {
  MockContextUserService,
  createMockUserService,
} from '../../shared/mocks/users/user.service.mock';
import { ImageService } from '../../image/image.service';
import {
  MockContextImageService,
  createMockImageService,
} from '../../shared/mocks/image/image.service.mock';
import { MailerService } from '../../mailer/mailer.service';
import {
  MockContextMailerService,
  createMockMailerService,
} from '../../shared/mocks/mailer/mailer.service.mock';
import { ImageWithUrl } from '../../types/generic';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockRepository: MockContextProductRepo;
  let mockUserService: MockContextUserService;
  let mockImageService: MockContextImageService;
  let mockMailerService: MockContextMailerService;
  const product = buildProduct({
    isEnable: true,
    category: undefined,
    id: undefined,
    images: undefined,
  }) as unknown as Product;
  const DISABLE_PRODUCT = false;
  const ENABLE_PRODUCT = true;
  const user = buildUser() as unknown as User;
  const image = buildImage({ url: getUrl }) as unknown as ImageWithUrl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: 'ProductRepository', useFactory: createMockProductRepo },
        { provide: UserService, useFactory: createMockUserService },
        { provide: ImageService, useFactory: createMockImageService },
        { provide: MailerService, useFactory: createMockMailerService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    mockRepository = module.get<MockContextProductRepo>('ProductRepository');
    mockUserService = module.get<MockContextUserService>(UserService);
    mockImageService = module.get<MockContextImageService>(ImageService);
    mockMailerService = module.get<MockContextMailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      mockRepository.create.mockResolvedValueOnce(product);

      const actual = await service.create(
        product as unknown as CreateProductInput,
      );

      expect(actual).toEqual(product);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const categoryId = getId;
    const disabledProduct = true;
    it('should return a list of products', async () => {
      const listProduct = [product, product, product];
      mockRepository.findAll.mockResolvedValueOnce(listProduct);

      const actual = await service.findAll({
        categoryId,
        embedDisabledProducts: disabledProduct,
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
        product as unknown as UpdateProductInput,
      );

      expect(actual).toEqual(product);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });

    it('throw an error when the product does not exits', async () => {
      product.description = getDescription();
      mockRepository.findOne.mockResolvedValueOnce(null);

      const actual = () =>
        service.update(product.id, product as unknown as UpdateProductInput);

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
        mockRepository.findOne.mockResolvedValueOnce(product);

        const actual = await service.createLike(
          userLikeProduct.userId,
          userLikeProduct.productId,
        );

        expect(actual).toEqual({ ...userLikeProduct, type: 'like' });
        expect(mockRepository.findLike).toHaveBeenCalledTimes(1);
        expect(mockRepository.createLike).toHaveBeenCalledTimes(1);
      });

      it('Delete like when user already liked the product', async () => {
        mockRepository.findLike.mockResolvedValueOnce(
          userLikeProduct as UserLikeProduct,
        );
        mockRepository.deleteLike.mockResolvedValueOnce(
          userLikeProduct as UserLikeProduct,
        );
        mockRepository.findOne.mockResolvedValue(product);

        const actual = await service.createLike(
          userLikeProduct.userId,
          userLikeProduct.productId,
        );

        expect(actual).toEqual({ ...userLikeProduct, type: 'unliked' });
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

  describe('changeProductStatus', () => {
    it('should update product to enable when is disenable', async () => {
      product.isEnable = DISABLE_PRODUCT;
      mockRepository.findOne.mockResolvedValueOnce(product);
      mockRepository.update.mockResolvedValueOnce({
        ...product,
        isEnable: ENABLE_PRODUCT,
      });

      const actual = await service.changeProductStatus(product.id);

      expect(actual).toHaveProperty('isEnable', ENABLE_PRODUCT);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should update product to disable when is enable', async () => {
      product.isEnable = ENABLE_PRODUCT;
      mockRepository.findOne.mockResolvedValueOnce(product);
      mockRepository.update.mockResolvedValueOnce({
        ...product,
        isEnable: DISABLE_PRODUCT,
      });

      const actual = await service.changeProductStatus(product.id);

      expect(actual).toHaveProperty('isEnable', DISABLE_PRODUCT);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });

    it('throw ProductNotFoundException when product does not exits', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      const actual = () => service.changeProductStatus(product.id);

      expect(actual).rejects.toEqual(new ProductNotFoundException());
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('checkStockLessThan3', () => {
    const userLikeProduct = {
      userId: getId,
      productId: getId,
    } as UserLikeProduct;
    const listImages = [image];
    it("should invoke sendEmailLowStock when product's stock less or equal 3", async () => {
      product.id = getId;
      product.stock = 3;
      mockRepository.findLastLike.mockResolvedValueOnce(userLikeProduct);
      mockRepository.findOne.mockResolvedValue(product);
      mockUserService.findOneById.mockResolvedValueOnce(user);
      mockImageService.getImagesByProductId.mockResolvedValueOnce(listImages);

      await service.checkStockLessThan3(product.id);

      expect(mockRepository.findLastLike).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockImageService.getImagesByProductId).toHaveBeenCalled();
    });

    it('should return null when does not exist like in the product', async () => {
      product.id = getId;
      mockRepository.findLastLike.mockResolvedValueOnce(null);

      const actual = await service.checkStockLessThan3(product.id);

      expect(actual).toEqual(null);
      expect(mockRepository.findLastLike).toHaveBeenCalledTimes(1);
    });
  });
});
