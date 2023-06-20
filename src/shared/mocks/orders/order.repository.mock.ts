import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import PrismaOrderRepository from '../../../orders/orders.repository';

export type MockContextOrderRepo = DeepMockProxy<PrismaOrderRepository>;

export const createMockOrderRepo = () => mockDeep<PrismaOrderRepository>();
