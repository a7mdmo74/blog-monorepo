"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ImageUpload } from "@/components/image-upload";
import {
  createPost,
  getAllCategories,
  getAllTags,
  type Category,
  type Tag,
} from "@/lib/api";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewPostPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [status, setStatus] = useState("DRAFT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    Promise.all([getAllCategories(), getAllTags()])
      .then(([c, t]) => {
        setCategories(c);
        setTags(t);
      })
      .catch(() => {});
  }, [router]);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  }

  function toggleTag(id: string) {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError("");
    setLoading(true);

    try {
      await createPost(token, {
        title,
        slug,
        content: content || undefined,
        excerpt: excerpt || undefined,
        coverImage: coverImage || undefined,
        status,
        categoryId: categoryId || undefined,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      });
      toast.success("Post created successfully!");
      router.push("/dashboard");
    } catch {
      setError("Failed to create post. The slug may already be taken.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-16">
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Back to dashboard
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">New Post</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder="My new post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugManuallyEdited(true);
              }}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-mono outline-none transition-colors focus:border-primary"
              placeholder="my-new-post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Excerpt <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary resize-none"
              placeholder="A brief summary of the post..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary resize-y"
              placeholder="Write your post content here..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Cover Image{" "}
              <span className="text-muted font-normal">(optional)</span>
            </label>
            {token && (
              <ImageUpload
                token={token}
                value={coverImage}
                onChange={setCoverImage}
              />
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-muted font-normal">(optional)</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              >
                <option value="">None</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags <span className="text-muted font-normal">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      selectedTagIds.includes(tag.id)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted hover:border-foreground"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
            <Link
              href="/dashboard"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-foreground"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
