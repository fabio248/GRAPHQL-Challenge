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
import { mockClient } from 'aws-sdk-client-mock';
import { S3Client } from '@aws-sdk/client-s3';

describe('ImageService', () => {
  // const s3ClientMock = mockClient(S3Client);
  let service: ImageService;
  let mockImageRepository: MockContextImageRepo;
  let mockProductService: MockContextProductService;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
