import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Tag } from './tag.model.js';
import { CreateTagInput } from './create-tag.input.js';
import { UpdateTagInput } from './update-tag.input.js';
import { TagService } from './tag.service.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard.js';

@Resolver(() => Tag)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [Tag], { name: 'tags' })
  async tags() {
    return this.tagService.findAll();
  }

  @Query(() => Tag, { name: 'tag', nullable: true })
  async tag(@Args('id', { type: () => ID }) id: string) {
    return this.tagService.findById(id);
  }

  @Mutation(() => Tag)
  @UseGuards(GqlAuthGuard)
  async createTag(@Args('input') input: CreateTagInput) {
    return this.tagService.create(input);
  }

  @Mutation(() => Tag)
  @UseGuards(GqlAuthGuard)
  async updateTag(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTagInput,
  ) {
    return this.tagService.update(id, input);
  }

  @Mutation(() => Tag)
  @UseGuards(GqlAuthGuard)
  async deleteTag(@Args('id', { type: () => ID }) id: string) {
    return this.tagService.delete(id);
  }
}
