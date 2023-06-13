import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { UserService } from '../../../users/users.service';

export type MockContextUserService = DeepMockProxy<UserService>;

export const createMockUserService = () => mockDeep<UserService>();
