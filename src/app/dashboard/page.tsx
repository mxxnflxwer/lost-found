"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, PlusCircle, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface Item {
  id: string;
  type: string;
  name: string;
  category: string;
  location: string;
  date: string;
  status: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
  if (status === "PENDING") return <span className={`${base} bg-zinc-100 text-zinc-600`}><Clock className="h-3 w-3 mr-1" />Pending</span>;
  if (status === "MATCHED") return <span className={`${base} bg-zinc-200 text-zinc-700`}><AlertCircle className="h-3 w-3 mr-1" />Matched</span>;
  if (status === "RESOLVED") return <span className={`${base} bg-zinc-800 text-white`}><CheckCircle2 className="h-3 w-3 mr-1" />Resolved</span>;
  return <span className={base}>{status}</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "LOST" | "FOUND">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "MATCHED" | "RESOLVED">("ALL");
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.user) { router.push("/login"); return; }
      setUser(d.user);
    });
    fetch("/api/items?mine=1").then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  }, [router]);

  const filtered = items.filter(i =>
    (filter === "ALL" || i.type === filter) &&
    (statusFilter === "ALL" || i.status === statusFilter)
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Reports</h1>
            <p className="text-muted text-sm mt-0.5">Hello, {user?.name || user?.email || "..."}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/report-lost" className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-primary hover:bg-primary/5 transition">
              <Search className="h-4 w-4" /> Report Lost
            </Link>
            <Link href="/report-found" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
              <PlusCircle className="h-4 w-4" /> Report Found
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["ALL", "LOST", "FOUND"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${filter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted hover:border-primary/50"}`}>
              {f === "ALL" ? "All Types" : f === "LOST" ? "Lost Items" : "Found Items"}
            </button>
          ))}
          <div className="h-5 w-px bg-border self-center mx-1" />
          {(["ALL", "PENDING", "MATCHED", "RESOLVED"] as const).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition ${statusFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted hover:border-primary/50"}`}>
              {f === "ALL" ? "All Status" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-zinc-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-lg font-medium">No items found</p>
            <p className="text-sm mt-1">Try adjusting your filters, or submit a new report.</p>
          </div>
        ) : (
          <div className="border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-zinc-50">
                  <th className="text-left px-5 py-3 font-medium text-muted">Item</th>
                  <th className="text-left px-5 py-3 font-medium text-muted hidden sm:table-cell">Type</th>
                  <th className="text-left px-5 py-3 font-medium text-muted hidden md:table-cell">Category</th>
                  <th className="text-left px-5 py-3 font-medium text-muted hidden md:table-cell">Date</th>
                  <th className="text-left px-5 py-3 font-medium text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-primary">{item.name}</td>
                    <td className="px-5 py-4 text-muted hidden sm:table-cell">{item.type}</td>
                    <td className="px-5 py-4 text-muted hidden md:table-cell">{item.category}</td>
                    <td className="px-5 py-4 text-muted hidden md:table-cell">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
