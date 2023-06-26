import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthResponse } from './dto/types/auth-response.types';
import { SignInInput, SignUpInput } from './dto/input';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  sayHelloWorld(): string {
    return 'hello world';
  }

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
}
