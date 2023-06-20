import { Test, TestingModule } from '@nestjs/testing';
import { MockContext, createMockContext } from '../../shared/mocks/prisma.mock';
import { ImageRepository } from '../../shared/repository.interface';
import { PrismaService } from '../../database/prisma.service';
import PrismaImageRepository from '../image.repository';
import { buildImage } from '../../shared/generate';
import { Image } from '@prisma/client';

describe('PrismaImageRepository', () => {
  let repository: ImageRepository;
  let mockPrisma: MockContext;
  const image = buildImage() as unknown as Image;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaImageRepository,
        { provide: PrismaService, useFactory: createMockContext },
      ],
    }).compile();

    repository = module.get<PrismaImageRepository>(PrismaImageRepository);
    mockPrisma = module.get<MockContext>(PrismaService);
  });

  describe('create', () => {
    it('should create a image entity', async () => {
      mockPrisma.image.create.mockResolvedValueOnce(image);

      const actual = await repository.create(image);

      expect(actual).toEqual(image);
      expect(mockPrisma.image.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a images searched by id', async () => {
      mockPrisma.image.findUnique.mockResolvedValueOnce(image);

      const actual = await repository.findOne({ id: image.id });

      expect(actual).toEqual(image);
      expect(mockPrisma.image.findUnique).toHaveBeenCalledTimes(1);
    });
  });
});
