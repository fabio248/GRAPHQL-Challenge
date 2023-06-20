import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ImageService } from '../../../image/image.service';

export type MockContextImageService = DeepMockProxy<ImageService>;

export const createMockImageService = () => mockDeep<ImageService>();
