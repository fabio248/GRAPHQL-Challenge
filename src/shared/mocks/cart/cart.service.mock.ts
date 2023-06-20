import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { CartService } from '../../../cart/services/cart.service';

export type MockContextCartService = DeepMockProxy<CartService>;

export const createMockCartService = () => mockDeep<CartService>();
