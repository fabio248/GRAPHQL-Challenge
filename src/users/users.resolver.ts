import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserEntiy } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decoratos/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UserService } from './users.service';
import { UserResponse } from './dto/response/user-response.dto';
import { UpdateUserInput } from './dto/input/update-user.input';

@Resolver()
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserEntiy, {
    name: 'getMyInfo',
    description: 'user can have access their own info',
  })
  findOne(@CurrentUser(['CLIENT']) user: JwtPayload) {
    return this.userService.findOneById(+user.sub);
  }

  @Mutation(() => UserEntiy, {
    name: 'updateMyInfo',
    description: 'user can update their own info',
  })
  update(
    @CurrentUser(['CLIENT']) user: JwtPayload,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.userService.update(+user.sub, updateUserInput);
  }

  @Mutation(() => UserEntiy, {
    name: 'deleteYourOwnAccount',
    description: 'delete your account',
  })
  remove(@CurrentUser() user: JwtPayload) {
    return this.userService.remove(+user.sub);
  }
}
