import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PostCard } from "@/components/post-card";
import { getCategoryBySlug, getPublishedPosts } from "@/lib/api";
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
];

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category;
  let posts: Post[] = FALLBACK_POSTS;

  try {
    category = await getCategoryBySlug(slug);
    if (category) {
      const allPosts = await getPublishedPosts();
      posts = allPosts.filter((p) => p.category?.slug === slug);
    }
  } catch {}

  if (!category) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        <p className="mt-2 text-muted">
          Articles in the {category.name} category.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <p className="mt-12 text-center text-muted">
            No posts in this category yet.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return { title: "Category Not Found" };
    return { title: `${category.name} — Blog` };
  } catch {
    return { title: "Category Not Found" };
  }
}
