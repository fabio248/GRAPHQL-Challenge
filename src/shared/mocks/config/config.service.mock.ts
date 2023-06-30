import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';

export type MockContextConfigService = DeepMockProxy<ConfigService>;

export const createMockConfigService = () => mockDeep<ConfigService>();
