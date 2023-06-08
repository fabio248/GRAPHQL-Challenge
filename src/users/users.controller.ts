import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import JwtAuthenticationGuard from 'src/auth/strategies/jwt/jwt-auth.guard';
import { Request } from 'express';
import { PayloadJwt } from 'src/@types/generic';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Req() req: Request) {
    const user = req.user as PayloadJwt;
    return this.usersService.findOneById(+user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthenticationGuard)
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user as PayloadJwt;

    return this.usersService.update(+user.sub, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthenticationGuard)
  remove(@Req() req: Request) {
    const user = req.user as PayloadJwt;

    return this.usersService.remove(+user.sub);
  }
}
