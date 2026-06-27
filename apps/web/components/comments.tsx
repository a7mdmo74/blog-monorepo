"use client";

import { useState, useEffect } from "react";
import type { Comment } from "@/lib/api";
import { getCommentsByPost, createComment, deleteComment } from "@/lib/api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Comments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {}
    }
  }, []);

  useEffect(() => {
    getCommentsByPost(postId)
      .then(setComments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const comment = await createComment(token, {
        content: content.trim(),
        postId,
      });
      setComments((prev) => [...prev, comment]);
      setContent("");
    } catch {
      setError("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!token) return;
    try {
      await deleteComment(token, id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {}
  }

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-xl font-bold tracking-tight">
        Comments ({comments.length})
      </h2>

      {token && user && (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a comment..."
            required
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary resize-none"
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="mt-3 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      )}

      {!token && (
        <p className="mt-4 text-sm text-muted">
          <a href="/login" className="text-primary hover:text-primary-light font-medium">
            Sign in
          </a>{" "}
          to leave a comment.
        </p>
      )}

      <div className="mt-8 space-y-6">
        {loading && (
          <p className="text-sm text-muted">Loading comments...</p>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-sm text-muted">
            No comments yet. Be the first to share your thoughts.
          </p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {comment.author.name.charAt(0).toUpperCase()}
                </span>
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-muted">·</span>
                <time className="text-xs text-muted">
                  {formatDate(comment.createdAt)}
                </time>
              </div>
              {user && user.id === comment.authorId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-muted hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
