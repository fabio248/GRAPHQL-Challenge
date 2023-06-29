import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerResolver } from './mailer.resolver';

@Module({
  providers: [MailerService, MailerResolver],
  exports: [MailerService],
})
export class MailerModule {}
