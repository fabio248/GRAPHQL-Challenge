import { Test, TestingModule } from '@nestjs/testing';
import { PrismaUserRepository } from '../prisma.user.repository';
import { MockContext, createMockContext } from '../../shared/mocks/prisma.mock';
import { PrismaService } from '../../database/prisma.service';
import { buildUser, getId, getUsername } from '../../shared/generate';
import { User } from '@prisma/client';
import { GenericRepository } from '../../shared/repository.interface';

describe('PrismaUserRepository', () => {
  let repository: GenericRepository<User>;
  let prismaMock: MockContext;
  let user = buildUser() as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaUserRepository,
        { provide: PrismaService, useFactory: createMockContext },
      ],
    }).compile();
    repository = module.get<PrismaUserRepository>(PrismaUserRepository);
    prismaMock = module.get<MockContext>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of user', async () => {
      const listUser = [
        buildUser(),
        buildUser(),
        buildUser(),
      ] as unknown as User[];
      prismaMock.user.findMany.mockResolvedValueOnce(listUser);

      const actual = await repository.findAll({});

      expect(actual).toEqual(listUser);
      expect(actual).toHaveLength(listUser.length);
    });
  });

  describe('findOne', () => {
    it('should return a specific user', async () => {
      const id = getId;
      user = { ...user, id };
      prismaMock.user.findUnique.mockResolvedValueOnce(user);

      const actual = await repository.findOne({ id });

      expect(actual).toEqual(user);
      expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      prismaMock.user.create.mockResolvedValueOnce(user);

      const actual = await repository.create({ user });

      expect(actual).toEqual(user);
      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = getId;
      const newUserName = getUsername;
      prismaMock.user.update.mockResolvedValueOnce({
        ...user,
        id,
        username: newUserName,
      });

      const actual = await repository.update({
        where: { id },
        data: { ...user, username: newUserName },
      });

      expect(actual).toHaveProperty('username', newUserName);
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a user searched by id', async () => {
      const id = getId;
      user = { ...user, id };
      prismaMock.user.delete.mockResolvedValueOnce(user);

      const actual = await repository.delete({ id });

      expect(actual).toEqual(user);
    });
  });
});
