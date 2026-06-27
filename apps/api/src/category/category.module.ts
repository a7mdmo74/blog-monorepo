import { Module } from '@nestjs/common';
import { CategoryResolver } from './category.resolver.js';
import { CategoryService } from './category.service.js';

@Module({
  providers: [CategoryResolver, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
