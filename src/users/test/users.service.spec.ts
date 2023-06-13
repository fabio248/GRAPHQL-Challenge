import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../users.service';
import {
  MockContextUserRepo,
  createMockUserRepo,
} from '../../shared/mocks/users/user.repository.mock';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import {
  buildUser,
  getEmail,
  getId,
  getPassword,
  getToken,
} from '../../shared/generate';
import UserNotFoundException from '../expections/user-not-found.exception';
import { CreateUserDto } from '../dto/request/create-user.dto';
import EmailAlreadyTakenException from '../expections/email-already-taken.expection';
import { UpdateUserDto } from '../dto/request/update-user.dto';
import * as Jwt from 'jsonwebtoken';
import { UserResponse } from '../dto/response/user-response.dto';

describe('UsersService', () => {
  let service: UserService;
  let mockUserRepository: MockContextUserRepo;
  const user = buildUser() as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'UserRepository', useFactory: createMockUserRepo },
        ConfigService,
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockUserRepository = module.get<MockContextUserRepo>('UserRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of users', async () => {
      const listUser = [
        buildUser(),
        buildUser(),
        buildUser(),
      ] as unknown as User[];
      mockUserRepository.findAll.mockResolvedValueOnce(listUser);

      const actual = await service.findAll({});

      expect(actual).toHaveLength(listUser.length);
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
  describe('findOneById', () => {
    const id = getId;
    it('should return a user that exits without sensitive info', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(user);

      const actual = await service.findOneById(id);

      expect(actual).toEqual({ ...user, password: undefined });
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('throw an error when user does not exits', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null);

      const actual = () => service.findOneById(id);

      expect(actual).rejects.toEqual(new UserNotFoundException());
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user searched by email', async () => {
      const email = getEmail;
      mockUserRepository.findOne.mockResolvedValueOnce({ ...user, email });

      const actual = await service.findOneByEmail(email);

      expect(actual).toEqual({ ...user, email });
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new user and return without sensitive info', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      mockUserRepository.create.mockResolvedValueOnce(user);

      const actual = await service.create(user as unknown as CreateUserDto);

      expect(actual).toEqual({ ...user, password: undefined });
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });

    it('throw an error when email is already taken', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(user);

      const actual = () => service.create(user as unknown as CreateUserDto);

      expect(actual).rejects.toEqual(new EmailAlreadyTakenException());
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user and hash password when it is pass by argument', async () => {
      const id = getId;
      const newPassword = getPassword;
      mockUserRepository.update.mockResolvedValueOnce({
        ...user,
        password: newPassword,
      });

      const actual = await service.update(id, user as unknown as UpdateUserDto);

      expect(actual).toEqual({ ...user, password: undefined });
    });

    it('should update a user and return user without sensitive info', async () => {
      const id = getId;
      const user = buildUser({ password: undefined }) as User;
      mockUserRepository.update.mockResolvedValueOnce(user);

      const actual = await service.update(id, user as UpdateUserDto);

      expect(actual).toEqual({ ...user, password: undefined });
    });
  });

  describe('remove', () => {
    it('should delete user', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(user);
      mockUserRepository.delete.mockResolvedValueOnce(user);

      const actual = await service.remove(user.id);

      expect(actual).toEqual({ ...user, password: undefined });
      expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createAccessToken', () => {
    it('should create an access token', async () => {
      const token = getToken;
      const spySignJwt = jest.spyOn(Jwt, 'sign');
      spySignJwt.mockImplementation(() => token);

      const actual = await service.createAccessToken(user as UserResponse);

      expect(actual).toEqual(token);
      expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
      expect(spySignJwt).toHaveBeenCalledTimes(1);
    });
  });
});
