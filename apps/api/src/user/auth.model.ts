import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.model.js';

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;

  @Field(() => User)
  user: User;
}
