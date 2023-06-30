import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import PrismaProductInCarRepository from '../../../cart/repositories/product-in-cart.repository';

export type MockContextProductInCartRepo =
  DeepMockProxy<PrismaProductInCarRepository>;

export const createMockProductInCartRepo = () =>
  mockDeep<PrismaProductInCarRepository>();
