import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PostCard } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/api";
import type { Post } from "@/lib/api";

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

export default async function PostsPage() {
  let posts = FALLBACK_POSTS;

  try {
    const fetched = await getPublishedPosts();
    if (fetched.length > 0) posts = fetched;
  } catch {}

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">All Posts</h1>
        <p className="mt-2 text-muted">
          Browse all published articles.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="mt-12 text-center text-muted">No posts yet.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
