import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">About</h1>
        <div className="mt-8 space-y-6 text-muted leading-relaxed">
          <p>
            Welcome to the blog. This is a space for sharing ideas, tutorials,
            and deep dives into software engineering, web development, and
            technology.
          </p>
          <p>
            Built with Next.js, NestJS, GraphQL, and Prisma — this blog is
            also a learning project for full-stack TypeScript development.
          </p>
          <h2 className="text-xl font-semibold text-foreground pt-4">
            Tech Stack
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Frontend:</strong> Next.js 16, React 19, Tailwind CSS</li>
            <li><strong>Backend:</strong> NestJS, GraphQL (Apollo), Prisma</li>
            <li><strong>Database:</strong> PostgreSQL (Neon)</li>
            <li><strong>Monorepo:</strong> Turborepo</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
