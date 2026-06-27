import Link from "next/link";
import type { Category } from "@/lib/api";

export function Categories({ categories }: { categories: Category[] }) {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-2xl font-bold tracking-tight">
          Browse by Category
        </h2>
        <p className="mt-1 text-muted">
          Find articles on the topics that matter to you.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
