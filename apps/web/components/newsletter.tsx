export function Newsletter() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-8 sm:p-12">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight">
            Stay in the loop
          </h2>
          <p className="mt-2 text-muted">
            Get notified when new articles are published. No spam, unsubscribe
            anytime.
          </p>
          <form className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
