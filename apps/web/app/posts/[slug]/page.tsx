import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Comments } from "@/components/comments";
import { getPostBySlug } from "@/lib/api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-16">
        <Link
          href="/posts"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Back to posts
        </Link>

        <article className="mt-8">
          <div className="flex items-center gap-3 text-sm text-muted">
            {post.category && (
              <Link
                href={`/categories/${post.category.slug}`}
                className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                {post.category.name}
              </Link>
            )}
            <time>{formatDate(post.createdAt)}</time>
            <span>·</span>
            <span>{post.author.name}</span>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-lg text-muted leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {post.coverImage && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {post.content ? (
            <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none text-base leading-7 whitespace-pre-wrap">
              {post.content}
            </div>
          ) : (
            <div className="mt-10 text-muted">
              This post does not have content yet.
            </div>
          )}
        </article>

        <Comments postId={post.id} />
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
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: `${post.title} — Blog`,
      description: post.excerpt ?? undefined,
    };
  } catch {
    return { title: "Post Not Found" };
  }
}
