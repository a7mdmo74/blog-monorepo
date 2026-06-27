"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface StoredUser {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/login");
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      router.push("/login");
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
    router.refresh();
  }

  if (!user) return null;

  const initial = user.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>

        <div className="mt-8 rounded-2xl border border-border bg-card p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
              {initial}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted">{user.email}</p>
              {user.role && (
                <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                  {user.role}
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted uppercase tracking-wider">
                User ID
              </p>
              <p className="mt-1 text-sm font-mono">{user.id}</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted uppercase tracking-wider">
                Email
              </p>
              <p className="mt-1 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-light"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
