import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { AuthService } from '../../../auth/auth.service';

export type MockContextAuthService = DeepMockProxy<AuthService>;

export const createMockAuthService = () => mockDeep<AuthService>();
