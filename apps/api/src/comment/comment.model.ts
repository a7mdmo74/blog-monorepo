import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../user/user.model.js';

@ObjectType()
export class Comment {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  authorId: string;

  @Field(() => User)
  author: User;

  @Field()
  postId: string;

  @Field(() => String, { nullable: true })
  parentId: string | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
