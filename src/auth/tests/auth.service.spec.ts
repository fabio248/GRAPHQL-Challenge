import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailerService } from './../../mailer/mailer.service';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/users.service';
import {
  MockContextUserService,
  createMockUserService,
} from '../../shared/mocks/users/user.service.mock';
import {
  buildUser,
  getEmail,
  getId,
  getPassword,
  getToken,
} from '../../shared/generate';
import { AuthUnauthorizedException, InvalidTokenException } from '../exception';
import UserNotFoundException from '../../users/expections/user-not-found.exception';
import * as Jwt from 'jsonwebtoken';
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: MockContextUserService;
  const user = buildUser() as User;
  const accessToken = getToken;
  const recoveryToken = getToken;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useFactory: createMockUserService },
        MailerService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUserService = module.get<MockContextUserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const spyCompareSyncBcrypt = jest.spyOn(bcrypt, 'compareSync');
    it('should return user and accessToken when credentials are valid', async () => {
      const passwordMatch = true;
      mockUserService.findOneByEmail.mockResolvedValueOnce(user);
      mockUserService.createAccessToken.mockResolvedValueOnce(accessToken);
      spyCompareSyncBcrypt.mockReturnValueOnce(passwordMatch);
      const expected = { user, accessToken };

      const actual = await service.singIn({
        email: user.email,
        password: user.password,
      });

      expect(actual).toEqual(expected);
      expect(mockUserService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).toHaveReturnedWith(passwordMatch);
    });

    it('throw an error when user does not exits', async () => {
      const passwordDoesNotMatch = false;
      mockUserService.findOneByEmail.mockResolvedValueOnce(null);
      spyCompareSyncBcrypt.mockReturnValueOnce(passwordDoesNotMatch);

      await expect(
        service.singIn({
          email: user.email,
          password: user.password,
        }),
      ).rejects.toEqual(new AuthUnauthorizedException());

      expect(mockUserService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).not.toHaveBeenCalled();
    });

    it('throw an error when the password is invalid', async () => {
      const wrongPassword = getPassword;
      const passwordDoesNotMatch = false;
      mockUserService.findOneByEmail.mockResolvedValueOnce(user);
      spyCompareSyncBcrypt.mockReturnValueOnce(passwordDoesNotMatch);

      await expect(
        service.singIn({
          email: user.email,
          password: wrongPassword,
        }),
      ).rejects.toEqual(new AuthUnauthorizedException());

      expect(mockUserService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).toHaveReturnedWith(passwordDoesNotMatch);
    });
  });

  describe('sendRecoveryToken', () => {
    it('throw an error when user does no exits', async () => {
      const email = getEmail;
      mockUserService.findOneByEmail.mockResolvedValueOnce(null);

      const actual = () => service.sendRecoveryEmail(email);

      expect(actual).rejects.toEqual(new UserNotFoundException());
      expect(mockUserService.findOneByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('changePassword', () => {
    const newPassword = getPassword;

    it("throw InvalidTokenException when the token does not have user's id", async () => {
      const spyJwtVerify = jest.spyOn(Jwt, 'verify');
      spyJwtVerify.mockImplementationOnce(() => null);

      const actual = () =>
        service.changePassword({ newPassword, recoveryToken });

      expect(actual).rejects.toEqual(new InvalidTokenException());
      expect(spyJwtVerify).toHaveBeenCalledTimes(1);
      expect(mockUserService.isValidRecoveryToken).not.toHaveBeenCalledTimes(1);
    });
  });
});
