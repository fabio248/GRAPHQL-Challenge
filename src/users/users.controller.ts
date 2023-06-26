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
  Query,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { PayloadJwt } from 'src/types/generic';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('skip') skip: number, @Query('take') take: number) {
    return this.usersService.findAll({ skip, take });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findOne(@Req() req: Request) {
    const user = req.user as PayloadJwt;
    return this.usersService.findOneById(+user.sub);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user as PayloadJwt;

    return this.usersService.update(+user.sub, updateUserDto);
  }

  @Delete('me')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: Request) {
    const user = req.user as PayloadJwt;

    return this.usersService.remove(+user.sub);
  }
}
