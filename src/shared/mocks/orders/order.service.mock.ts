import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

import { OrdersService } from '../../../orders/orders.service';

export type MockContextOrderService = DeepMockProxy<OrdersService>;

export const createMockOrderService = () => mockDeep<OrdersService>();
