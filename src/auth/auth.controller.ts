import {
  Controller,
  Post,
  HttpCode,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './strategies/local/local-auth.guard';
import { Request, Response } from 'express';
import { UserResponse } from 'src/users/dto/response/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('sing-in')
  async singIn(@Req() req: Request, @Res() res: Response) {
    const { user } = req;

    const accessToken: string = await this.authService.createAccessToken(
      user as UserResponse,
    );

    res.json({ accessToken });
  }
}
