import { Query, Resolver } from '@nestjs/graphql';
import { MailerService } from './mailer.service';

@Resolver()
export class MailerResolver {
  constructor(private readonly mailerService: MailerService) {}

  @Query(() => String || Boolean)
  sendMail() {
    return this.mailerService.sendMail({
      to: 'fabioflores021@gmail.com',
      subject: 'prueba',
      html: '<p>hola esto es una prueba </p>',
    });
  }
}
