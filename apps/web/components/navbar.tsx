"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface StoredUser {
  id: string;
  name: string;
  email: string;
}

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }

    function onStorage() {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Blog
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link href="/posts" className="transition-colors hover:text-foreground">
            Posts
          </Link>
          <Link href="/categories" className="transition-colors hover:text-foreground">
            Categories
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground">
            About
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              <div className="relative group">
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-light">
                  {initial}
                </button>
                <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-xl border border-border bg-card shadow-lg group-hover:block">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2.5 text-sm text-muted hover:bg-card-hover hover:text-foreground transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2.5 text-sm text-muted hover:bg-card-hover hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-muted hover:bg-card-hover hover:text-foreground transition-colors rounded-b-xl"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-light"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
