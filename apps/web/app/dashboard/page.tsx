"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  getPostsByAuthor,
  deletePost,
  type Post,
} from "@/lib/api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (!storedUser || !storedToken) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(storedUser);
    setUser(parsed);
    setToken(storedToken);

    getPostsByAuthor(parsed.id)
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  async function handleDelete(id: string) {
    if (!token) return;
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(token, id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted">
              Manage your posts, {user.name}.
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
          >
            New Post
          </Link>
        </div>

        {loading && (
          <p className="mt-12 text-center text-muted">Loading posts...</p>
        )}

        {!loading && posts.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted">You haven&apos;t written any posts yet.</p>
            <Link
              href="/dashboard/new"
              className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              Write your first post
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="mt-8 space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${
                        post.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {post.status}
                    </span>
                    <time>{formatDate(post.createdAt)}</time>
                  </div>
                  <h3 className="mt-1 text-lg font-semibold truncate">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-1 text-sm text-muted truncate">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex items-center gap-2 shrink-0">
                  <Link
                    href={`/dashboard/${post.id}/edit`}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-foreground"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-foreground"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
