import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/index.js';
import { CreateTagInput } from './create-tag.input.js';
import { UpdateTagInput } from './update-tag.input.js';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateTagInput) {
    const existing = await this.prisma.tag.findFirst({
      where: { OR: [{ name: input.name }, { slug: input.slug }] },
    });
    if (existing) {
      throw new ConflictException('Tag name or slug already exists');
    }
    return this.prisma.tag.create({ data: input });
  }

  async findAll() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async update(id: string, input: UpdateTagInput) {
    return this.prisma.tag.update({ where: { id }, data: input });
  }

  async delete(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
