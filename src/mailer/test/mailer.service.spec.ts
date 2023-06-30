import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '../mailer.service';
import { ConfigService } from '@nestjs/config';
import { getEmail, getTitleProducts } from '../../shared/generate';
import { createTransport } from 'nodemailer';
import {
  MockContextConfigService,
  createMockConfigService,
} from '../../shared/mocks/config/config.service.mock';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));
describe('MailerService', () => {
  let service: MailerService;
  let mockConfigService: MockContextConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerService,
        { provide: ConfigService, useFactory: createMockConfigService },
      ],
    }).compile();

    service = module.get<MailerService>(MailerService);
    mockConfigService = module.get<MockContextConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sent mail', async () => {
    const bodyMail = {
      to: getEmail,
      subject: getTitleProducts(),
      html: '',
    };

    await service.sendMail(bodyMail);
  });
});
