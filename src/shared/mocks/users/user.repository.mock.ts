import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaUserRepository } from '../../../users/prisma.user.repository';

export type MockContextUserRepo = DeepMockProxy<PrismaUserRepository>;

export const createMockUserRepo = () => mockDeep<PrismaUserRepository>();
