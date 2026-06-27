import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAllCategories } from "@/lib/api";
import type { Category } from "@/lib/api";
import Link from "next/link";

const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", name: "Frontend", slug: "frontend" },
  { id: "2", name: "Backend", slug: "backend" },
  { id: "3", name: "DevOps", slug: "devops" },
  { id: "4", name: "TypeScript", slug: "typescript" },
];

export default async function CategoriesPage() {
  let categories = FALLBACK_CATEGORIES;

  try {
    const fetched = await getAllCategories();
    if (fetched.length > 0) categories = fetched;
  } catch {}

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="mt-2 text-muted">
          Browse articles by topic.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {cat.name}
              </h2>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
