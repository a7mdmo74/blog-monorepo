import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            Welcome to the blog
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Thoughts, stories & ideas
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted max-w-xl">
            Explore articles on software engineering, web development, and the
            latest in technology. Built with care and curiosity.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/posts"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              Read the Blog
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-foreground"
            >
              About Me
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
    </section>
  );
}
