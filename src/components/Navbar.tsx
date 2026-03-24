"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PackageSearch, User, LogOut } from "lucide-react";

interface SessionUser { name?: string; email: string; role: string; }

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { setUser(d.user || null); setLoading(false); });
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-200 ${scrolled ? "shadow-sm" : ""}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <PackageSearch className="h-6 w-6 text-primary" />
          <span className="font-bold tracking-tight text-primary">Lost & Found</span>
        </Link>
        <nav className="flex items-center space-x-4 sm:space-x-6 text-sm font-medium">
          <Link href="/report-lost" className="text-muted hover:text-primary transition-colors hidden sm:inline">Report Lost</Link>
          <Link href="/report-found" className="text-muted hover:text-primary transition-colors hidden sm:inline">Report Found</Link>
          <div className="h-4 w-px bg-border hidden sm:block" aria-hidden="true" />
          {loading ? (
            <div className="h-8 w-20 rounded-lg bg-zinc-100 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              {user.role === "ADMIN" && (
                <Link href="/admin" className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-primary transition">Admin</Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-1.5 text-muted hover:text-primary transition-colors">
                <User className="h-4 w-4" /> <span className="hidden sm:inline">{user.name || user.email.split("@")[0]}</span>
              </Link>
              <button onClick={logout} className="flex items-center gap-1 text-muted hover:text-primary transition" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-muted hover:text-primary transition-colors">Sign In</Link>
              <Link href="/register" className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
