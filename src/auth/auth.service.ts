/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ChangePasswordInput } from './dto/input/change-password.input';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as Jwt from 'jsonwebtoken';
import { SignInInput } from './dto/input/sign-in.input';
import { SignUpInput } from './dto/input/sign-up.input';
import { UserService } from '../users/users.service';
import { AuthUnauthorizedException, InvalidTokenException } from './exception';
import {
  AuthResponse,
  ChangedPaswordResponse,
  MailResponse,
} from './dto/types';
import { MailerService } from '../mailer/mailer.service';
import UserNotFoundException from '../users/expections/user-not-found.exception';
import { ConfigService } from '@nestjs/config';
import { getRecoveryMail, getChangedPaswordMail } from './utils/mailsFormat';
import { SendRecoveryEmailInput } from './dto/input';
@Injectable()
export class AuthService {
  private secret = this.configService.get<string>('jwt.secret');

  constructor(
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(singUpInput: SignUpInput): Promise<AuthResponse> {
    const user = await this.userService.create(singUpInput);
    const accessToken = await this.userService.createAccessToken(user);

    return { user, accessToken };
  }

  async singIn(signInInput: SignInInput): Promise<AuthResponse> {
    const { password, email } = signInInput;
    const user: User | null = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new AuthUnauthorizedException();
    }

    const isMatchPassword: boolean = bcrypt.compareSync(
      password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new AuthUnauthorizedException();
    }

    const accessToken = await this.userService.createAccessToken(user);

    return { user, accessToken };
  }

  async sendRecoveryEmail(sendRecoveryEmailInput: SendRecoveryEmailInput) {
    const { email } = sendRecoveryEmailInput;

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    const recoveryToken = Jwt.sign({ sub: user.id }, this.secret as string, {
      expiresIn: '15min',
    });

    this.userService.update(user.id, { recoveryToken });

    const emailBody = getRecoveryMail(user.username, recoveryToken);

    this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      html: emailBody,
    });

    const response = new MailResponse(email);

    return response;
  }

  async sendChangedPassword(userId: number) {
    const { email, username } = await this.userService.findOneById(userId);

    const emailBody = getChangedPaswordMail(username);

    this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      html: emailBody,
    });

    const response = new ChangedPaswordResponse(email);

    return response;
  }

  async changePassword(changePasswordInput: ChangePasswordInput) {
    try {
      const { newPassword, recoveryToken } = changePasswordInput;
      const { sub: userId } = Jwt.verify(recoveryToken, this.secret as string);

      const isValidToken = await this.userService.isValidRecoveryToken(
        +userId!,
        recoveryToken,
      );

      if (!isValidToken) {
        throw new InvalidTokenException();
      }

      this.userService.update(+userId!, {
        password: newPassword,
        recoveryToken: null,
      });

      return this.sendChangedPassword(+userId!);
    } catch (error) {
      throw new InvalidTokenException();
    }
  }
}
