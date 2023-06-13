import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import PrismaProductRepository from '../../../products/prisma.product.repository';

export type MockContextProductRepo = DeepMockProxy<PrismaProductRepository>;

export const createMockProductRepo = () => mockDeep<PrismaProductRepository>();
