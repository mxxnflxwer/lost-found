"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Link2, Users, LogOut, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

interface Item {
  id: string; type: string; name: string; category: string;
  location: string; date: string; status: string;
  user: { name: string; email: string };
}
interface Match {
  id: string; score: number; status: string;
  lostItem: Item; foundItem: Item;
}

type ActiveView = "reports" | "matches" | "users";

function StatusBadge({ status }: { status: string }) {
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium";
  if (status === "PENDING") return <span className={`${base} bg-zinc-100 text-zinc-600`}><Clock className="h-3 w-3"/>Pending</span>;
  if (status === "MATCHED") return <span className={`${base} bg-zinc-200 text-zinc-700`}><AlertCircle className="h-3 w-3"/>Matched</span>;
  if (status === "RESOLVED" || status === "APPROVED") return <span className={`${base} bg-zinc-800 text-white`}><CheckCircle2 className="h-3 w-3"/>Resolved</span>;
  if (status === "REJECTED") return <span className={`${base} bg-red-100 text-red-600`}><XCircle className="h-3 w-3"/>Rejected</span>;
  return <span className={base}>{status}</span>;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ActiveView>("reports");
  const [items, setItems] = useState<Item[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<{id:string;name:string;email:string;role:string;_count:{items:number}}[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{matchId:string;action:"approve"|"reject"} | null>(null);
  const [search, setSearch] = useState("");

  async function checkAdmin() {
    const r = await fetch("/api/auth/me");
    const d = await r.json();
    if (!d.user || d.user.role !== "ADMIN") { router.push("/login"); }
  }

  async function loadData(view: ActiveView) {
    setLoading(true);
    if (view === "reports") {
      const r = await fetch("/api/items"); const d = await r.json();
      setItems(Array.isArray(d) ? d : []);
    } else if (view === "matches") {
      const r = await fetch("/api/matches"); const d = await r.json();
      setMatches(Array.isArray(d) ? d : []);
    } else {
      const r = await fetch("/api/users"); const d = await r.json();
      setUsers(Array.isArray(d) ? d : []);
    }
    setLoading(false);
  }

  useEffect(() => { checkAdmin(); }, []);
  useEffect(() => { loadData(activeView); }, [activeView]);

  async function handleMatchAction(matchId: string, action: "approve" | "reject") {
    await fetch("/api/matches", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ matchId, action }) });
    setConfirmDialog(null);
    loadData("matches");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }); router.push("/login");
  }

  const navItems = [
    { id: "reports" as ActiveView, icon: FileText, label: "Reports" },
    { id: "matches" as ActiveView, icon: Link2, label: "Matches" },
    { id: "users" as ActiveView, icon: Users, label: "Users" },
  ];

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));
  const filteredMatches = matches.filter(m => m.lostItem.name.toLowerCase().includes(search.toLowerCase()) || m.foundItem.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border bg-background flex flex-col py-6 px-3 shrink-0">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted uppercase tracking-widest px-3 mb-3">Navigation</p>
          {navItems.map(nav => (
            <button key={nav.id} onClick={() => setActiveView(nav.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${activeView === nav.id ? "bg-primary text-primary-foreground" : "text-muted hover:bg-zinc-100 hover:text-primary"}`}>
              <nav.icon className="h-4 w-4" /> {nav.label}
            </button>
          ))}
        </div>
        <div className="mt-auto border-t border-border pt-4">
          <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-red-50 hover:text-red-600 transition">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="border-b border-border px-6 py-4 flex items-center gap-4">
          <LayoutDashboard className="h-5 w-5 text-muted" />
          <h1 className="font-bold text-primary">{activeView === "reports" ? "Reports" : activeView === "matches" ? "Matches" : "Users"}</h1>
          <div className="ml-auto">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="px-3 py-1.5 rounded-lg border border-border text-sm bg-background text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 w-48 transition" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-12 rounded-xl bg-zinc-100 animate-pulse" />)}</div>
          ) : activeView === "reports" ? (
            <div className="border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-zinc-50 border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted">Item</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Reported By</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-primary">{item.name}</td>
                      <td className="px-4 py-3 text-muted">{item.type}</td>
                      <td className="px-4 py-3 text-muted">{item.category}</td>
                      <td className="px-4 py-3 text-muted">{item.user?.name || item.user?.email}</td>
                      <td className="px-4 py-3 text-muted">{new Date(item.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length === 0 && <p className="text-center py-10 text-muted text-sm">No reports found.</p>}
            </div>
          ) : activeView === "matches" ? (
            <div className="space-y-4">
              {filteredMatches.length === 0 && <p className="text-center py-10 text-muted text-sm">No matches found.</p>}
              {filteredMatches.map(match => (
                <div key={match.id} className="border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={match.status} />
                      <span className="text-xs text-muted">Match score: <span className="font-semibold text-primary">{match.score}%</span></span>
                    </div>
                    {match.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button onClick={() => setConfirmDialog({matchId: match.id, action: "approve"})}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-medium hover:bg-zinc-700 transition">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button onClick={() => setConfirmDialog({matchId: match.id, action: "reject"})}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition">
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ label: "LOST ITEM", item: match.lostItem }, { label: "FOUND ITEM", item: match.foundItem }].map(({ label, item }) => (
                      <div key={label} className="rounded-xl bg-zinc-50 border border-zinc-100 p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">{label}</p>
                        <p className="font-semibold text-primary">{item.name}</p>
                        <p className="text-xs text-muted mt-1">{item.category} · {item.location}</p>
                        <p className="text-xs text-muted">{new Date(item.date).toLocaleDateString()} · {item.user?.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-zinc-50 border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Reports</th>
                  <th className="text-left px-4 py-3 font-medium text-muted">Joined</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-primary">{u.name || "—"}</td>
                      <td className="px-4 py-3 text-muted">{u.email}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${u.role === "ADMIN" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-600"}`}>{u.role}</span></td>
                      <td className="px-4 py-3 text-muted">{u._count.items}</td>
                      <td className="px-4 py-3 text-muted">{new Date((u as unknown as {createdAt:string}).createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="text-center py-10 text-muted text-sm">No users found.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-2xl shadow-xl p-6 w-80 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-primary mb-2">{confirmDialog.action === "approve" ? "Approve Match?" : "Reject Match?"}</h3>
            <p className="text-sm text-muted mb-5">
              {confirmDialog.action === "approve"
                ? "Both items will be marked as Resolved."
                : "Both items will revert to Pending status."}
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDialog(null)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted hover:bg-zinc-50 transition">Cancel</button>
              <button onClick={() => handleMatchAction(confirmDialog.matchId, confirmDialog.action)}
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition ${confirmDialog.action === "approve" ? "bg-zinc-800 hover:bg-zinc-700" : "bg-red-600 hover:bg-red-700"}`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
