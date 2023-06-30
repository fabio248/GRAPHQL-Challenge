import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { MailerService } from '../../../mailer/mailer.service';

export type MockContextMailerService = DeepMockProxy<MailerService>;

export const createMockMailerService = () => mockDeep<MailerService>();
