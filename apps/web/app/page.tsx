import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { FeaturedPosts } from "@/components/featured-posts";
import { Categories } from "@/components/categories";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";
import { getPublishedPosts, getAllCategories } from "@/lib/api";
import type { Post, Category } from "@/lib/api";

const FALLBACK_POSTS: Post[] = [
  {
    id: "1",
    title: "Getting Started with NestJS and GraphQL",
    slug: "getting-started-nestjs-graphql",
    content: null,
    excerpt:
      "Learn how to build a production-ready API with NestJS, GraphQL, and Prisma from scratch.",
    author: { id: "1", name: "Admin", email: "admin@blog.com" },
    category: { id: "1", name: "Backend", slug: "backend" },
    tags: [],
    coverImage: null,
    status: "PUBLISHED",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    title: "Building a Modern Blog with Next.js 16",
    slug: "building-modern-blog-nextjs-16",
    content: null,
    excerpt:
      "A deep dive into the latest Next.js features and how to use them for a performant blog.",
    author: { id: "1", name: "Admin", email: "admin@blog.com" },
    category: { id: "2", name: "Frontend", slug: "frontend" },
    tags: [],
    coverImage: null,
    status: "PUBLISHED",
    createdAt: "2025-01-12",
  },
  {
    id: "3",
    title: "Monorepos with Turborepo: A Practical Guide",
    slug: "monorepos-turborepo-practical-guide",
    content: null,
    excerpt:
      "How to structure, manage, and scale a monorepo for full-stack TypeScript projects.",
    author: { id: "1", name: "Admin", email: "admin@blog.com" },
    category: { id: "3", name: "DevOps", slug: "devops" },
    tags: [],
    coverImage: null,
    status: "PUBLISHED",
    createdAt: "2025-01-10",
  },
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", name: "Frontend", slug: "frontend" },
  { id: "2", name: "Backend", slug: "backend" },
  { id: "3", name: "DevOps", slug: "devops" },
  { id: "4", name: "TypeScript", slug: "typescript" },
];

export default async function Home() {
  let posts = FALLBACK_POSTS;
  let categories = FALLBACK_CATEGORIES;

  try {
    const [fetchedPosts, fetchedCategories] = await Promise.all([
      getPublishedPosts(),
      getAllCategories(),
    ]);
    if (fetchedPosts.length > 0) posts = fetchedPosts;
    if (fetchedCategories.length > 0) categories = fetchedCategories;
  } catch {
    // API unavailable — use fallback data
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedPosts posts={posts} />
        <Categories categories={categories} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
