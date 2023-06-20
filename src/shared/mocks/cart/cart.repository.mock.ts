import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import PrismaCartRepository from '../../../cart/repositories/cart.repository';

export type MockContextCartRepo = DeepMockProxy<PrismaCartRepository>;

export const createMockCartRepo = () => mockDeep<PrismaCartRepository>();
