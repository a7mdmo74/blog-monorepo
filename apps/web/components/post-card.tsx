import Link from "next/link";
import type { Post } from "@/lib/api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
    >
      <div className="flex items-center gap-2 text-xs text-muted">
        {post.category && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
            {post.category.name}
          </span>
        )}
        <span>·</span>
        <time>{formatDate(post.createdAt)}</time>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <span className="font-medium">{post.author.name}</span>
        {post.tags.length > 0 && (
          <>
            <span>·</span>
            <span>{post.tags.map((t) => t.name).join(", ")}</span>
          </>
        )}
      </div>
    </Link>
  );
}
