import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ProductsService } from '../../../products/products.service';

export type MockContextProductService = DeepMockProxy<ProductsService>;

export const createMockProductService = () => mockDeep<ProductsService>();
