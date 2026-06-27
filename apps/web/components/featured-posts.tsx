import Link from "next/link";
import { PostCard } from "@/components/post-card";
import type { Post } from "@/lib/api";

export function FeaturedPosts({ posts }: { posts: Post[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Latest Posts</h2>
          <p className="mt-1 text-muted">
            Fresh articles and tutorials from the blog.
          </p>
        </div>
        <Link
          href="/posts"
          className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
