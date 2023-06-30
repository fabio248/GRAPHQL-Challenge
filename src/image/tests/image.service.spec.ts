import { Test, TestingModule } from '@nestjs/testing';
import { ImageService } from '../image.service';
import {
  MockContextImageRepo,
  createMockImageRepo,
} from '../../shared/mocks/image/image.repository';
import {
  MockContextProductService,
  createMockProductService,
} from '../../shared/mocks/product/product.service.mock';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from '../../products/products.service';
import { buildImage, buildProduct, getUrl } from '../../shared/generate';
import { Image } from '@prisma/client';
import { ImageNotFoundException } from '../exception/image-not-found.expection';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ProductEntity } from '../../products/entities';
jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn(),
}));
describe('ImageService', () => {
  // const s3ClientMock = mockClient(S3Client);
  let service: ImageService;
  let mockImageRepository: MockContextImageRepo;
  let mockProductService: MockContextProductService;
  const mockGetSignedUrl = getSignedUrl as jest.Mock;
  const expectedUrl = getUrl;
  const image = buildImage() as unknown as Image;
  const product = buildProduct() as unknown as ProductEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'ImageRepository', useFactory: createMockImageRepo },
        { provide: ProductsService, useFactory: createMockProductService },
        ImageService,
        ConfigService,
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
    mockImageRepository = module.get<MockContextImageRepo>('ImageRepository');
    mockProductService = module.get<MockContextProductService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an image search by id', async () => {
      mockImageRepository.findOne.mockResolvedValueOnce(image);

      const actual = await service.findOne(image.id);

      expect(actual).toEqual(image);
      expect(mockImageRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('throw an error when image does not exits', async () => {
      mockImageRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(image.id)).rejects.toEqual(
        new ImageNotFoundException(),
      );

      expect(mockImageRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a image and return url to upload image', async () => {
      mockProductService.findOneById.mockResolvedValueOnce(product);
      mockGetSignedUrl.mockReturnValueOnce(expectedUrl);
      mockImageRepository.create.mockResolvedValueOnce(image);

      const actual = await service.create({
        mimetype: image.mimetype,
        productId: product.id,
      });

      expect(actual).toEqual({
        ...image,
        url: expectedUrl,
      });
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
      expect(mockProductService.findOneById).toHaveBeenCalledTimes(1);
      expect(mockImageRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUrlToUploadImage', () => {
    it('should return a url to upload image to s3 bucket', async () => {
      mockGetSignedUrl.mockResolvedValueOnce(expectedUrl);

      const actual = await service.createUrlToUploadImage(
        image.name,
        image.mimetype,
      );

      expect(actual).toEqual(expectedUrl);
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    });
  });

  describe('getImagesByProductId', () => {
    const listImages = [image, image];
    it('should return a images with url to see images', async () => {
      mockImageRepository.findAllByProductId.mockResolvedValueOnce(listImages);
      mockGetSignedUrl.mockResolvedValue(expectedUrl);

      const actual = await service.getImagesByProductId(product.id);

      expect(actual).toHaveLength(listImages.length);
      expect(mockGetSignedUrl).toHaveBeenCalledTimes(listImages.length);
    });
  });
});
