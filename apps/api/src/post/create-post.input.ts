import { InputType, Field } from '@nestjs/graphql';
import { PostStatus } from '../generated/prisma/client.js';

@InputType()
export class CreatePostInput {
  @Field()
  title: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  excerpt?: string;

  @Field({ nullable: true })
  coverImage?: string;

  @Field(() => PostStatus, { nullable: true, defaultValue: PostStatus.DRAFT })
  status?: PostStatus;

  @Field({ nullable: true })
  categoryId?: string;

  @Field(() => [String], { nullable: true })
  tagIds?: string[];
}
