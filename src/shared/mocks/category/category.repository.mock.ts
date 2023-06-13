import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import PrismaCategoryRepository from '../../../category/prisma.category.repository';

export type MockContextCategoryRepo = DeepMockProxy<PrismaCategoryRepository>;

export const createMockCategoryRepo = () =>
  mockDeep<PrismaCategoryRepository>();
