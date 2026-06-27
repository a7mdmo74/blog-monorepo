import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/index.js';
import { CreateCategoryInput } from './create-category.input.js';
import { UpdateCategoryInput } from './update-category.input.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCategoryInput) {
    const existing = await this.prisma.category.findFirst({
      where: { OR: [{ name: input.name }, { slug: input.slug }] },
    });
    if (existing) {
      throw new ConflictException('Category name or slug already exists');
    }
    return this.prisma.category.create({ data: input });
  }

  async findAll() {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, input: UpdateCategoryInput) {
    return this.prisma.category.update({ where: { id }, data: input });
  }

  async delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
