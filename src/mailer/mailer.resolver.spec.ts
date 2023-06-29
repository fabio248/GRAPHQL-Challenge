import { Test, TestingModule } from '@nestjs/testing';
import { MailerResolver } from './mailer.resolver';

describe('MailerResolver', () => {
  let resolver: MailerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerResolver],
    }).compile();

    resolver = module.get<MailerResolver>(MailerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
