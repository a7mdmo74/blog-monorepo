import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/index.js';
import { CreateCommentInput } from './create-comment.input.js';
import { UpdateCommentInput } from './update-comment.input.js';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = { author: true };

  async create(authorId: string, input: CreateCommentInput) {
    return this.prisma.comment.create({
      data: { ...input, authorId },
      include: this.include,
    });
  }

  async findByPost(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: this.include,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: this.include,
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async update(id: string, input: UpdateCommentInput) {
    return this.prisma.comment.update({
      where: { id },
      data: input,
      include: this.include,
    });
  }

  async delete(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
