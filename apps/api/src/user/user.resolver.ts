import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { User } from './user.model.js';
import { AuthPayload } from './auth.model.js';
import { RegisterInput } from './register.input.js';
import { LoginInput } from './login.input.js';
import { UpdateUserInput } from './update-user.input.js';
import { UserService } from './user.service.js';
import { GqlAuthGuard } from '../auth/auth.guard.js';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput) {
    return this.userService.register(input);
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return this.userService.login(input);
  }

  @Query(() => User, { name: 'me', nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@Context() ctx: any) {
    return this.userService.findById(ctx.req.user.sub);
  }

  @Query(() => [User], { name: 'users' })
  async users() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  async user(@Args('id', { type: () => ID }) id: string) {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async updateUser(
    @Context() ctx: any,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.userService.update(ctx.req.user.sub, input);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async deleteUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.delete(id);
  }
}
