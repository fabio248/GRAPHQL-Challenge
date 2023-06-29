import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthResponse, MailResponse } from './dto/types';
import { ChangePasswordInput, SignInInput, SignUpInput } from './dto/input';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, {
    name: 'SignUp',
    description: 'Register a new user',
  })
  async signUp(
    @Args('signUpInput') singUpInput: SignUpInput,
  ): Promise<AuthResponse> {
    return this.authService.signUp(singUpInput);
  }

  @Mutation(() => AuthResponse, { name: 'SignIn', description: 'Login user' })
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
  ): Promise<AuthResponse> {
    return this.authService.singIn(signInInput);
  }

  @Mutation(() => MailResponse, {
    name: 'sendRecoveryPasswordMail',
  })
  sendEmail(@Args('email', { type: () => String }) email: string) {
    return this.authService.sendRecoveryEmail(email);
  }

  @Mutation(() => MailResponse, {
    name: 'changePassword',
  })
  changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
  ) {
    return this.authService.changePassword(changePasswordInput);
  }
}
