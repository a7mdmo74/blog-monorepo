import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver.js';
import { CommentService } from './comment.service.js';

@Module({
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
