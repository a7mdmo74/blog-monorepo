import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Category } from './category.model.js';
import { CreateCategoryInput } from './create-category.input.js';
import { UpdateCategoryInput } from './update-category.input.js';
import { CategoryService } from './category.service.js';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard.js';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { name: 'categories' })
  async categories() {
    return this.categoryService.findAll();
  }

  @Query(() => Category, { name: 'category', nullable: true })
  async category(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.findById(id);
  }

  @Mutation(() => Category)
  @UseGuards(GqlAuthGuard)
  async createCategory(@Args('input') input: CreateCategoryInput) {
    return this.categoryService.create(input);
  }

  @Mutation(() => Category)
  @UseGuards(GqlAuthGuard)
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.categoryService.update(id, input);
  }

  @Mutation(() => Category)
  @UseGuards(GqlAuthGuard)
  async deleteCategory(@Args('id', { type: () => ID }) id: string) {
    return this.categoryService.delete(id);
  }
}
