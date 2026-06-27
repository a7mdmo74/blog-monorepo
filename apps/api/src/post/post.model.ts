import { ObjectType, Field, ID, Float, registerEnumType } from '@nestjs/graphql';
import { PostStatus } from '../generated/prisma/client.js';
import { User } from '../user/user.model.js';
import { Category } from '../category/category.model.js';
import { Tag } from '../tag/tag.model.js';

registerEnumType(PostStatus, { name: 'PostStatus' });

@ObjectType()
export class Post {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field(() => String, { nullable: true })
  content: string | null;

  @Field(() => String, { nullable: true })
  excerpt: string | null;

  @Field(() => String, { nullable: true })
  coverImage: string | null;

  @Field(() => PostStatus)
  status: PostStatus;

  @Field(() => Float, { nullable: true })
  publishedAt: number | null;

  @Field()
  authorId: string;

  @Field(() => User)
  author: User;

  @Field(() => String, { nullable: true })
  categoryId: string | null;

  @Field(() => Category, { nullable: true })
  category: Category | null;

  @Field(() => [Tag])
  tags: Tag[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
