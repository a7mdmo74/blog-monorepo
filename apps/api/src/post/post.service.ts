import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/index.js';
import { CreatePostInput } from './create-post.input.js';
import { UpdatePostInput } from './update-post.input.js';
import { PostStatus } from '../generated/prisma/client.js';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    author: true,
    category: true,
    tags: true,
  };

  async create(authorId: string, input: CreatePostInput) {
    const { tagIds, ...data } = input;
    return this.prisma.post.create({
      data: {
        ...data,
        authorId,
        tags: tagIds?.length
          ? { connect: tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: this.include,
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: this.include,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: this.include,
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async findByAuthor(authorId: string) {
    return this.prisma.post.findMany({
      where: { authorId },
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCategory(categoryId: string) {
    return this.prisma.post.findMany({
      where: { categoryId },
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByTag(tagId: string) {
    return this.prisma.post.findMany({
      where: { tags: { some: { id: tagId } } },
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublished() {
    return this.prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      include: this.include,
      orderBy: { publishedAt: 'desc' },
    });
  }

  async update(id: string, input: UpdatePostInput) {
    const { tagIds, ...data } = input;
    return this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        tags: tagIds !== undefined
          ? { set: tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: this.include,
    });
  }

  async delete(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
