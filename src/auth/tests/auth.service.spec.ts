import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../users/users.service';
import {
  MockContextUserService,
  createMockUserService,
} from '../../shared/mocks/users/user.service.mock';
import { buildUser, getPassword, getToken } from '../../shared/generate';
import { UserResponse } from '../../users/dto/response/user-response.dto';
import * as bcrypt from 'bcrypt';
import AuthUnauthorizedException from '../exception/unauthoried.expection';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: MockContextUserService;
  const user = buildUser() as UserResponse;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useFactory: createMockUserService },
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
    it('should return user without sensitive info when credentials are valid', async () => {
      const passwordMatch = true;
      mockUserService.findOneByEmail.mockResolvedValueOnce(user);
      spyCompareSyncBcrypt.mockReturnValueOnce(passwordMatch);

      const actual = await service.singIn(user.email, user.password);

      expect(actual).toEqual({ ...user, password: undefined });
      expect(mockUserService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).toHaveReturnedWith(passwordMatch);
    });

    it('throw an error when user does not exits', async () => {
      const passwordDoesNotMatch = false;
      mockUserService.findOneByEmail.mockResolvedValueOnce(null);
      spyCompareSyncBcrypt.mockReturnValueOnce(passwordDoesNotMatch);

      await expect(service.singIn(user.email, user.password)).rejects.toEqual(
        new AuthUnauthorizedException(),
      );

      expect(mockUserService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).not.toHaveBeenCalled();
    });

    it('throw an error when the password is invalid', async () => {
      const wrongPassword = getPassword;
      const passwordDoesNotMatch = false;
      mockUserService.findOneByEmail.mockResolvedValueOnce(user);
      spyCompareSyncBcrypt.mockReturnValueOnce(passwordDoesNotMatch);

      await expect(service.singIn(user.email, wrongPassword)).rejects.toEqual(
        new AuthUnauthorizedException(),
      );

      expect(mockUserService.findOneByEmail).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).toHaveBeenCalledTimes(1);
      expect(spyCompareSyncBcrypt).toHaveReturnedWith(passwordDoesNotMatch);
    });
  });

  describe('createAccessToken', () => {
    const token = getToken;
    it('should return a access token', async () => {
      mockUserService.createAccessToken.mockResolvedValueOnce(token);

      const actual = await service.createAccessToken(user);

      expect(actual).toEqual(token);
      expect(mockUserService.createAccessToken).toHaveBeenCalledTimes(1);
    });
  });
});
