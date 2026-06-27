import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { Comment } from './comment.model.js';
import { CreateCommentInput } from './create-comment.input.js';
import { UpdateCommentInput } from './update-comment.input.js';
import { CommentService } from './comment.service.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard.js';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment], { name: 'comments' })
  async comments(
    @Args('postId', { type: () => ID }) postId: string,
  ) {
    return this.commentService.findByPost(postId);
  }

  @Query(() => Comment, { name: 'comment', nullable: true })
  async comment(@Args('id', { type: () => ID }) id: string) {
    return this.commentService.findById(id);
  }

  @Mutation(() => Comment)
  @UseGuards(GqlAuthGuard)
  async createComment(
    @Context() ctx: any,
    @Args('input') input: CreateCommentInput,
  ) {
    return this.commentService.create(ctx.req.user.sub, input);
  }

  @Mutation(() => Comment)
  @UseGuards(GqlAuthGuard)
  async updateComment(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCommentInput,
  ) {
    return this.commentService.update(id, input);
  }

  @Mutation(() => Comment)
  @UseGuards(GqlAuthGuard)
  async deleteComment(@Args('id', { type: () => ID }) id: string) {
    return this.commentService.delete(id);
  }
}
