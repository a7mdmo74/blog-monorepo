import { Module } from '@nestjs/common';
import { TagResolver } from './tag.resolver.js';
import { TagService } from './tag.service.js';

@Module({
  providers: [TagResolver, TagService],
  exports: [TagService],
})
export class TagModule {}
