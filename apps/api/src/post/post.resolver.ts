import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { Post } from './post.model.js';
import { CreatePostInput } from './create-post.input.js';
import { UpdatePostInput } from './update-post.input.js';
import { PostService } from './post.service.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard.js';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post], { name: 'posts' })
  async posts() {
    return this.postService.findAll();
  }

  @Query(() => [Post], { name: 'publishedPosts' })
  async publishedPosts() {
    return this.postService.findPublished();
  }

  @Query(() => Post, { name: 'post', nullable: true })
  async post(@Args('id', { type: () => ID }) id: string) {
    return this.postService.findById(id);
  }

  @Query(() => Post, { name: 'postBySlug', nullable: true })
  async postBySlug(@Args('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Query(() => [Post], { name: 'postsByAuthor' })
  async postsByAuthor(@Args('authorId', { type: () => ID }) authorId: string) {
    return this.postService.findByAuthor(authorId);
  }

  @Query(() => [Post], { name: 'postsByCategory' })
  async postsByCategory(
    @Args('categoryId', { type: () => ID }) categoryId: string,
  ) {
    return this.postService.findByCategory(categoryId);
  }

  @Query(() => [Post], { name: 'postsByTag' })
  async postsByTag(@Args('tagId', { type: () => ID }) tagId: string) {
    return this.postService.findByTag(tagId);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async createPost(
    @Context() ctx: any,
    @Args('input') input: CreatePostInput,
  ) {
    return this.postService.create(ctx.req.user.sub, input);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async updatePost(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdatePostInput,
  ) {
    return this.postService.update(id, input);
  }

  @Mutation(() => Post)
  @UseGuards(GqlAuthGuard)
  async deletePost(@Args('id', { type: () => ID }) id: string) {
    return this.postService.delete(id);
  }
}
