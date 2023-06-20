import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from '../image.controller';
import { ImageService } from '../image.service';
import { createMockImageService } from '../../shared/mocks/image/image.service.mock';

describe('ImageController', () => {
  let controller: ImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        { provide: ImageService, useFactory: createMockImageService },
      ],
    }).compile();

    controller = module.get<ImageController>(ImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
