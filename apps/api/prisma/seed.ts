import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaNeon } from '@prisma/adapter-neon';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      name: 'Admin',
      password: 'hashed_password_here',
      role: 'ADMIN',
    },
  });

  const category = await prisma.category.upsert({
    where: { slug: 'general' },
    update: {},
    create: {
      name: 'General',
      slug: 'general',
      description: 'General blog posts',
    },
  });

  const tag = await prisma.tag.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      name: 'Hello World',
      slug: 'hello-world',
    },
  });

  const post = await prisma.post.upsert({
    where: { slug: 'first-post' },
    update: {},
    create: {
      title: 'First Post',
      slug: 'first-post',
      content: 'This is the first blog post!',
      excerpt: 'Welcome to the blog',
      status: 'PUBLISHED',
      publishedAt: new Date(),
      authorId: user.id,
      categoryId: category.id,
      tags: { connect: { id: tag.id } },
    },
  });

  console.log({ user, category, tag, post });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
