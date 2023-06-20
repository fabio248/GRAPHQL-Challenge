import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import PrismaImageRepository from '../../../image/image.repository';

export type MockContextImageRepo = DeepMockProxy<PrismaImageRepository>;

export const createMockImageRepo = () => mockDeep<PrismaImageRepository>();
