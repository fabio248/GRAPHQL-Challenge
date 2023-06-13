import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { CategoryService } from '../../../category/category.service';

export type MockContextCategoryService = DeepMockProxy<CategoryService>;

export const createMockCategoryService = () => mockDeep<CategoryService>();
