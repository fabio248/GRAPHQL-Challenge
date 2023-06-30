import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { MailBody } from './types/mail';

@Injectable()
export class MailerService {
  private host = this.configService.get('smtp.host');
  private port = this.configService.get('smtp.port');
  private email = this.configService.get('smtp.email');
  private password = this.configService.get('smtp.password');

  constructor(private readonly configService: ConfigService) {}

  async sendMail(bodyMail: MailBody): Promise<void> {
    const transporter = createTransport({
      host: this.host,
      port: this.port,
      secure: true, // true for 465, false for other ports
      auth: {
        user: this.email,
        pass: this.password,
      },
    });

    transporter.sendMail({
      ...bodyMail,
      from: this.email,
    });
  }
}
