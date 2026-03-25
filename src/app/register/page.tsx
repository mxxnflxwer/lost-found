"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageSearch } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-24 sm:py-32">
      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
              <PackageSearch className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-primary">Create an account</h1>
          <p className="text-muted text-sm mt-1">Start reporting and recovering items</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { id: "name", label: "Name", type: "text", value: name, set: setName, placeholder: "Jane Doe" },
              { id: "email", label: "Email", type: "email", value: email, set: setEmail, placeholder: "you@example.com" },
              { id: "password", label: "Password", type: "password", value: password, set: setPassword, placeholder: "Min. 6 characters" },
            ].map(field => (
              <div key={field.id} className="space-y-1">
                <label className="text-sm font-medium text-primary" htmlFor={field.id}>{field.label}</label>
                <input
                  id={field.id} type={field.type} value={field.value} onChange={e => field.set(e.target.value)}
                  required placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm text-primary placeholder:text-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>
            ))}
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
