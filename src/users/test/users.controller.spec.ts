import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UserService } from '../users.service';
import {
  MockContextUserService,
  createMockUserService,
} from '../../shared/mocks/users/user.service.mock';
import { buildReq, buildUser, getId, getUsername } from '../../shared/generate';
import { UserResponse } from '../dto/response/user-response.dto';
import { CreateUserDto } from '../dto/request/create-user.dto';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UpdateUserDto } from '../dto/request/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let mockService: MockContextUserService;
  const user = buildUser() as User;
  const req = buildReq();
  const userReq = buildUser({ id: req.user.sub });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UserService, useFactory: createMockUserService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    mockService = module.get<MockContextUserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('create', () => {
    it('should create a new user', async () => {
      mockService.create.mockResolvedValueOnce(user as UserResponse);

      const actual = await controller.create(user as CreateUserDto);

      expect(actual).toEqual(user);
      expect(mockService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return a list of user', async () => {
      const listUser = [
        buildUser(),
        buildUser(),
        buildUser(),
      ] as unknown as UserResponse[];
      const skip = getId;
      const take = getId;
      mockService.findAll.mockResolvedValueOnce(listUser);

      const actual = await controller.findAll(skip, take);

      expect(actual).toEqual(listUser);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      mockService.findOneById.mockResolvedValueOnce(userReq as UserResponse);
      const actual = await controller.findOne(req as unknown as Request);

      expect(actual).toEqual(user);
      expect(mockService.findOneById).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userReq = buildUser({ id: req.user.sub });
      mockService.update.mockReturnValueOnce(userReq as UserResponse);

      const actual = await controller.update(
        req as unknown as Request,
        {
          username: getUsername,
        } as UpdateUserDto,
      );

      expect(actual).toEqual(userReq);
      expect(mockService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockService.remove.mockResolvedValueOnce(userReq as UserResponse);

      const actual = await controller.remove(req as unknown as Request);

      expect(actual).toEqual(userReq);
      expect(mockService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
