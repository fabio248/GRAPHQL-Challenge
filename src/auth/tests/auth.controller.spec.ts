import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import {
  MockContextAuthService,
  createMockAuthService,
} from '../../shared/mocks/auth/auth.service.mock';
import { buildReq, buildRes, getToken } from '../../shared/generate';
import { Request, Response } from 'express';
import exp from 'constants';

describe('AuthController', () => {
  let controller: AuthController;
  let mockService: MockContextAuthService;
  const req = buildReq() as unknown as Request;
  const res = buildRes() as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: createMockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    mockService = module.get<MockContextAuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    const accessToken = getToken;
    it('should return an accessToken', async () => {
      mockService.createAccessToken.mockResolvedValueOnce(accessToken);

      await controller.singIn(req, res);

      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ accessToken });
    });
  });
});
