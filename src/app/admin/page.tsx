"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, LayoutDashboard, FileText, Link2, Users, Settings, 
  LogOut, CheckCircle2, XCircle, Clock, AlertCircle, 
  TrendingUp, ShieldCheck, History, MessageCircle, Download, ExternalLink,
  Eye, EyeOff, Image as ImageIcon
} from "lucide-react";

interface Item {
  id: string; type: string; name: string; category: string;
  description: string; location: string; date: string; status: string;
  user: { name: string; email: string };
  contactEmail: string; phone: string; imageUrl?: string;
  createdAt: string;
}
interface Match {
  id: string; score: number; status: string;
  lostItem: Item; foundItem: Item;
}
interface Enquiry {
  id: string; name: string; email: string; message: string; createdAt: string;
}

type ActiveView = "dashboard" | "reports" | "matches" | "users" | "enquiries" | "settings";

function StatusBadge({ status }: { status: string }) {
  const base = "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-tighter font-black";
  if (status === "PENDING") return <span className={`${base} bg-zinc-100 text-zinc-500`}><Clock className="h-2.5 w-2.5"/>Pending</span>;
  if (status === "UNDER_REVIEW") return <span className={`${base} bg-blue-50 text-blue-600`}><AlertCircle className="h-2.5 w-2.5"/>Review</span>;
  if (status === "MATCHED" || status === "APPROVED") return <span className={`${base} bg-zinc-900 text-white`}><CheckCircle2 className="h-2.5 w-2.5"/>Approved</span>;
  if (status === "RESOLVED") return <span className={`${base} bg-emerald-100 text-emerald-800`}><ShieldCheck className="h-2.5 w-2.5"/>Resolved</span>;
  if (status === "REJECTED") return <span className={`${base} bg-red-50 text-red-500`}><XCircle className="h-2.5 w-2.5"/>Rejected</span>;
  return <span className={base}>{status}</span>;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [items, setItems] = useState<Item[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [users, setUsers] = useState<{id:string;name:string;email:string;role:string;_count:{items:number};createdAt:string}[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{matchId:string;action:"approve"|"reject"|"resolve"} | null>(null);
  const [search, setSearch] = useState("");
  const [showContacts, setShowContacts] = useState<Record<string, boolean>>({});

  async function checkAdmin() {
    const r = await fetch("/api/auth/me");
    const d = await r.json();
    if (!d.user || d.user.role !== "ADMIN") { router.push("/login"); }
  }

  async function loadData() {
    setLoading(true);
    const [itemsRes, matchesRes, usersRes, enquiriesRes] = await Promise.all([
      fetch("/api/items"),
      fetch("/api/matches"),
      fetch("/api/users"),
      fetch("/api/enquiries")
    ]);
    const [itemsData, matchesData, usersData, enquiriesData] = await Promise.all([itemsRes.json(), matchesRes.json(), usersRes.json(), enquiriesRes.json()]);
    setItems(Array.isArray(itemsData) ? itemsData : []);
    setMatches(Array.isArray(matchesData) ? matchesData : []);
    setUsers(Array.isArray(usersData) ? usersData : []);
    setEnquiries(Array.isArray(enquiriesData) ? enquiriesData : []);
    setLoading(false);
  }

  useEffect(() => { checkAdmin(); loadData(); }, []);

  async function handleMatchAction(matchId: string, action: "approve" | "reject" | "resolve") {
    await fetch("/api/matches", { 
      method: "PATCH", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ matchId, action }) 
    });
    setConfirmDialog(null);
    loadData();
  }

  function downloadReport() {
    const data = [
      ["Report Type", "Item Name", "Category", "Location", "Date", "Status", "Owner"],
      ...items.map(i => [i.type, i.name, i.category, i.location, i.date, i.status, i.user?.email || "—"])
    ].map(e => e.join(",")).join("\n");
    
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lostfound_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }); 
    router.push("/login");
  }

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Overview" },
    { id: "reports", icon: FileText, label: "Archive" },
    { id: "matches", icon: Link2, label: "Verify Matches" },
    { id: "users", icon: Users, label: "Members" },
    { id: "enquiries", icon: MessageCircle, label: "User Support" },
    { id: "settings", icon: Settings, label: "System Config" },
  ] as { id: ActiveView, icon: any, label: string }[];

  const stats = {
    totalItems: items.length,
    pendingMatches: matches.filter(m => m.status === "UNDER_REVIEW").length,
    resolved: items.filter(i => i.status === "RESOLVED").length,
    usersCount: users.length,
    enquiriesCount: enquiries.length
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase()) ||
    i.location.toLowerCase().includes(search.toLowerCase())
  );
  const filteredMatches = matches.filter(m => 
    m.lostItem.name.toLowerCase().includes(search.toLowerCase()) || 
    m.foundItem.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col pt-8 pb-4 shrink-0">
        <div className="flex items-center gap-3 px-3 mb-10 transform active:scale-95 cursor-default group">
          <div className="h-9 w-9 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-zinc-900 uppercase">Control Tower</span>
        </div>
        
        <div className="space-y-1 my-4 flex-1">
          {navItems.map(nav => (
            <button 
              key={nav.id} 
              onClick={() => setActiveView(nav.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeView === nav.id 
                ? "bg-zinc-900 text-white shadow-2xl translate-x-1" 
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <nav.icon className={`h-4.5 w-4.5 ${activeView === nav.id ? "text-white" : "text-zinc-400"}`} /> 
              {nav.label}
              {nav.id === "matches" && stats.pendingMatches > 0 && (
                <span className="ml-auto bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">
                  {stats.pendingMatches}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-6 border-t border-zinc-100 space-y-4">
          <div className="px-3">
             <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-zinc-900 w-3/4" />
             </div>
             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2">Storage: 75% Full</p>
          </div>
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-all group"
          >
            <LogOut className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" /> 
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-20 border-b border-zinc-100 bg-white/80 backdrop-blur-md px-10 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-zinc-900 tracking-tight capitalize">{activeView}</h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-0.5">Admin Management System v2.0</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search database..." 
                className="pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100 focus:bg-white w-72 transition-all" 
              />
            </div>
            <button onClick={downloadReport} className="h-11 w-11 rounded-2xl bg-zinc-900 flex items-center justify-center text-white hover:bg-zinc-800 transition shadow-xl active:scale-90">
               <Download className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-10 bg-zinc-50/20">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-12 w-12 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin" />
            </div>
          ) : activeView === "dashboard" ? (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                 {[
                   { label: "Total Reports", val: stats.totalItems, icon: FileText, color: "bg-white" },
                   { label: "Suggested Matches", val: stats.pendingMatches, icon: Link2, color: "bg-blue-50 text-blue-600 border-blue-100" },
                   { label: "Resolved Cases", val: stats.resolved, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                   { label: "Platform Members", val: stats.usersCount, icon: Users, color: "bg-white" },
                 ].map(s => (
                   <div key={s.label} className={`p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm ${s.color} transition-all hover:shadow-xl hover:-translate-y-2`}>
                     <div className="flex justify-between items-start mb-6">
                        <div className="p-2.5 rounded-xl bg-zinc-50/50"><s.icon className="h-5 w-5" /></div>
                        <TrendingUp className="h-4 w-4 opacity-20" />
                     </div>
                     <p className="text-4xl font-black leading-none mb-2">{s.val}</p>
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{s.label}</p>
                   </div>
                 ))}
               </div>
               
               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                 <div className="xl:col-span-2 bg-white rounded-[3rem] border border-zinc-100 p-8 shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                      <h2 className="text-xl font-black text-zinc-900 flex items-center gap-2 tracking-tight"><History className="h-6 w-6 text-zinc-300" /> Live Feed</h2>
                      <button onClick={() => setActiveView("reports")} className="text-xs font-black text-zinc-400 hover:text-zinc-900 transition underline underline-offset-4">Browse Archive</button>
                   </div>
                   <div className="space-y-2">
                     {items.slice(0, 5).map(i => (
                       <div key={i.id} className="flex items-center justify-between p-6 rounded-3xl hover:bg-zinc-50 border border-transparent transition-all group">
                          <div className="flex items-center gap-4">
                            <div className={`h-14 w-14 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0`}>
                               {i.imageUrl ? <img src={i.imageUrl} className="h-full w-full object-cover" /> : <FileText className="h-5 w-5 text-zinc-300" />}
                            </div>
                            <div>
                               <p className="text-base font-black text-zinc-900 leading-none mb-1">{i.name}</p>
                               <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{i.category} · {new Date(i.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-zinc-900">{i.user?.name}</p>
                                <p className="text-[10px] text-zinc-400 font-bold">{i.user?.email}</p>
                             </div>
                             <StatusBadge status={i.status} />
                          </div>
                       </div>
                     ))}
                   </div>
                 </div>
                 
                 <div className="space-y-8">
                   <div className="bg-zinc-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl group min-h-[400px]">
                     <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                          <h2 className="text-2xl font-black mb-2 leading-none">Intelligence Hub</h2>
                          <p className="text-sm text-zinc-400 font-medium opacity-60">System matched 12 items this hour.</p>
                        </div>
                        <div className="space-y-6">
                          <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Top Category</p>
                             <p className="text-lg font-black tracking-tight">Electronics (54%)</p>
                          </div>
                          <button className="w-full py-4 rounded-2xl bg-white text-zinc-900 text-sm font-black hover:scale-105 transition shadow-xl">Audit Reports</button>
                        </div>
                     </div>
                     <LayoutDashboard className="absolute bottom-0 right-0 h-64 w-64 text-white opacity-5 translate-x-16 translate-y-16 group-hover:translate-x-12 group-hover:translate-y-12 transition-transform" />
                   </div>
                   
                   <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-100 shadow-sm flex items-center justify-between group cursor-pointer" onClick={() => setActiveView("enquiries")}>
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors"><MessageCircle className="h-6 w-6" /></div>
                         <div>
                            <p className="text-sm font-black text-zinc-900">User Enquiries</p>
                            <p className="text-xs text-zinc-400 font-bold">{stats.enquiriesCount} messages</p>
                         </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                   </div>
                 </div>
               </div>
            </div>
          ) : activeView === "reports" ? (
            <div className="bg-white border border-transparent rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-8 duration-700">
              <table className="w-full text-sm">
                <thead><tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="text-left px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Item Description</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Identifier</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Location</th>
                  <th className="text-left px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredItems.map(item => (
                    <tr key={item.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="px-10 py-6">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
                               {item.imageUrl ? <img src={item.imageUrl} className="h-full w-full object-cover" /> : <FileText className="h-4 w-4 text-zinc-300" />}
                            </div>
                            <div>
                               <div className="font-black text-zinc-900 mb-0.5 group-hover:translate-x-1 transition-transform">{item.name}</div>
                               <div className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{item.category}</div>
                            </div>
                         </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`text-[9px] font-black px-3 py-1 rounded-full ${item.type === "LOST" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="font-bold text-zinc-900">{item.location}</div>
                        <div className="text-[10px] text-zinc-400 font-bold">{new Date(item.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-10 py-6"><StatusBadge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredItems.length === 0 && <div className="text-center py-24 text-zinc-400 font-black tracking-tight">Zero matching records found.</div>}
            </div>
          ) : activeView === "matches" ? (
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-in zoom-in-95 duration-700">
               {filteredMatches.length === 0 && <div className="col-span-2 text-center py-24 text-zinc-400 font-black text-lg">System awaiting verification triggers...</div>}
               {filteredMatches.map(match => (
                 <div key={match.id} className="bg-white border border-zinc-100 rounded-[3rem] p-10 shadow-sm group hover:border-zinc-900 transition-all duration-500">
                   <div className="flex items-center justify-between mb-10">
                     <div className="flex items-center gap-3">
                       <StatusBadge status={match.status} />
                       <div className="h-8 w-px bg-zinc-100 mx-2" />
                       <span className="text-[10px] font-black text-zinc-900 px-4 py-1.5 bg-zinc-50 rounded-full border border-zinc-100">Match Integrity Score: {match.score}%</span>
                     </div>
                     {match.status === "UNDER_REVIEW" && (
                       <div className="flex gap-2">
                         <button onClick={() => setConfirmDialog({matchId: match.id, action: "approve"})} className="p-3.5 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 transition active:scale-90 shadow-2xl"><CheckCircle2 className="h-6 w-6"/></button>
                         <button onClick={() => setConfirmDialog({matchId: match.id, action: "reject"})} className="p-3.5 rounded-2xl border border-zinc-200 text-zinc-400 hover:text-red-500 transition active:scale-90"><XCircle className="h-6 w-6"/></button>
                       </div>
                     )}
                     {match.status === "APPROVED" && (
                        <button onClick={() => setConfirmDialog({matchId: match.id, action: "resolve"})} className="text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 bg-zinc-900 text-white rounded-2xl shadow-2xl hover:bg-zinc-800 transition active:scale-95">Finalize Verification</button>
                     )}
                   </div>
                   
                   <div className="relative">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-white border-2 border-zinc-50 rounded-full flex items-center justify-center shadow-xl transform group-hover:rotate-180 transition-transform duration-1000">
                        <Link2 className="h-6 w-6 text-zinc-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[match.lostItem, match.foundItem].map((it, idx) => (
                          <div key={idx} className="bg-zinc-50/50 p-8 rounded-[2.5rem] border border-zinc-100 group-hover:bg-zinc-50 transition-colors">
                            <div className="flex items-center justify-between mb-6">
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{idx === 0 ? "Lost" : "Found"}</p>
                              <button onClick={() => setShowContacts(prev => ({...prev, [it.id]: !prev[it.id]}))} className="p-1 text-zinc-300 hover:text-zinc-900 transition">
                                 {showContacts[it.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <div className="h-24 w-full bg-zinc-200 rounded-3xl mb-6 overflow-hidden border border-zinc-100">
                               {it.imageUrl ? <img src={it.imageUrl} className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center text-zinc-400"><ImageIcon className="h-8 w-8" /></div>}
                            </div>
                            <h4 className="text-xl font-black text-zinc-900 mb-1 leading-tight">{it.name}</h4>
                            <p className="text-[10px] text-zinc-400 font-black uppercase mb-6">{it.category}</p>
                            
                            <div className="pt-6 border-t border-zinc-200 space-y-3">
                               <div className="flex justify-between items-center"><span className="text-[9px] font-black text-zinc-400 uppercase">Location</span><span className="text-[10px] font-bold text-zinc-900">{it.location}</span></div>
                               <div className="flex justify-between items-center"><span className="text-[9px] font-black text-zinc-400 uppercase">Reporter</span><span className="text-[10px] font-bold text-zinc-900">{it.user?.name}</span></div>
                               {showContacts[it.id] ? (
                                 <div className="pt-3 border-t border-zinc-100 space-y-1 animate-in fade-in slide-in-from-top-1">
                                    <p className="text-[10px] font-black text-blue-600">{it.contactEmail}</p>
                                    <p className="text-[10px] font-black text-zinc-900">{it.phone}</p>
                                 </div>
                               ) : (
                                 <div className="pt-3 h-10 flex items-center justify-center">
                                    <div className="h-1 w-full bg-zinc-100 rounded-full" />
                                 </div>
                               )}
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          ) : activeView === "enquiries" ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
               {enquiries.length === 0 && <div className="col-span-3 text-center py-24 text-zinc-400 font-black">Archive is empty.</div>}
               {enquiries.map(e => (
                 <div key={e.id} className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all flex flex-col">
                   <div className="flex justify-between items-start mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg"><MessageCircle className="h-6 w-6 text-white" /></div>
                      <span className="text-[9px] font-black text-zinc-300 uppercase">{new Date(e.createdAt).toLocaleDateString()}</span>
                   </div>
                   <h4 className="text-lg font-black text-zinc-900 leading-tight mb-1">{e.name}</h4>
                   <p className="text-sm font-bold text-zinc-400 mb-6">{e.email}</p>
                   <div className="bg-zinc-50 p-6 rounded-[2rem] flex-grow">
                      <p className="text-sm text-zinc-600 font-medium leading-relaxed italic">&quot;{e.message}&quot;</p>
                   </div>
                 </div>
               ))}
             </div>
          ) : activeView === "users" ? (
             <div className="bg-white border border-transparent rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in duration-700 font-bold">
               <table className="w-full text-sm">
                 <thead><tr className="bg-zinc-50/50 border-b border-zinc-100">
                   <th className="text-left px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Identity Profile</th>
                   <th className="text-left px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tier</th>
                   <th className="text-left px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Engagement</th>
                   <th className="text-left px-10 py-6 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Join Date</th>
                 </tr></thead>
                 <tbody className="divide-y divide-zinc-50">
                   {users.map(u => (
                     <tr key={u.id} className="hover:bg-zinc-50 transition-colors">
                       <td className="px-10 py-6">
                          <div className="font-black text-zinc-900 mb-0.5">{u.name || "Member"}</div>
                          <div className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{u.email}</div>
                       </td>
                       <td className="px-10 py-6"><span className={`text-[9px] font-black px-4 py-1.5 rounded-full shadow-sm border ${u.role === "ADMIN" ? "bg-zinc-900 text-white border-zinc-900" : "bg-white border-zinc-100 text-zinc-500"}`}>{u.role}</span></td>
                       <td className="px-10 py-6 text-zinc-900 font-black">{u._count.items} active reports</td>
                       <td className="px-10 py-6 text-xs text-zinc-400 font-black uppercase">{new Date(u.createdAt).toLocaleDateString()}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          ) : (
            <div className="max-w-2xl bg-zinc-900 rounded-[3rem] p-12 text-white shadow-2xl animate-in slide-in-from-right-10 duration-700">
               <div className="flex items-center gap-4 mb-10">
                  <div className="h-14 w-14 rounded-3xl bg-white flex items-center justify-center"><Settings className="h-8 w-8 text-zinc-900" /></div>
                  <h2 className="text-3xl font-black tracking-tighter">System Engine</h2>
               </div>
               <div className="space-y-6">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 transition-colors">
                    <div><p className="font-black text-lg">AI Matching Core</p><p className="text-sm text-zinc-500 font-medium">Auto-trigger algorithm for new inputs.</p></div>
                    <div className="h-8 w-14 bg-emerald-500 rounded-full flex items-center px-1"><div className="h-6 w-6 bg-white rounded-full translate-x-6" /></div>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] opacity-40 cursor-not-allowed flex items-center justify-between">
                    <div><p className="font-black text-lg">SMTP Integration</p><p className="text-sm text-zinc-500 font-medium">Automatic email triggers on match detected.</p></div>
                    <div className="h-8 w-14 bg-zinc-800 rounded-full flex items-center px-1"><div className="h-6 w-6 bg-zinc-600 rounded-full" /></div>
                  </div>
                  <button className="w-full py-5 rounded-[2rem] bg-white text-zinc-900 text-sm font-black uppercase tracking-widest hover:scale-105 transition shadow-2xl">Push Global Update</button>
               </div>
            </div>
          )}
        </main>
      </div>

      {confirmDialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-xl animate-in fade-in duration-300 px-4">
          <div className="bg-white rounded-[3.5rem] shadow-2xl p-12 w-full max-w-sm border border-zinc-100 animate-in zoom-in-95 duration-300">
             <div className="flex flex-col items-center text-center mb-10">
                <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl ${confirmDialog.action === 'reject' ? 'bg-red-500 text-white' : 'bg-zinc-900 text-white'}`}>
                  {confirmDialog.action === 'reject' ? <XCircle className="h-10 w-10"/> : <CheckCircle2 className="h-10 w-10"/>}
                </div>
                <h3 className="text-3xl font-black text-zinc-900 leading-tight mb-2">Are you sure?</h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  {confirmDialog.action === "approve" ? "Commit to this match verification. Detailed profiles will be bridged." : 
                   confirmDialog.action === "resolve" ? "Mark this case as fully resolved and archiving record." : "Discard this intelligence suggestion and revert records."}
                </p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setConfirmDialog(null)} className="py-5 bg-zinc-50 rounded-[2rem] font-black text-zinc-400 text-xs uppercase tracking-widest hover:bg-zinc-100 transition">Revoke</button>
                <button onClick={() => handleMatchAction(confirmDialog.matchId, confirmDialog.action)} className={`py-5 ${confirmDialog.action === 'reject' ? 'bg-red-500' : 'bg-zinc-900'} text-white rounded-[2rem] font-black text-xs uppercase tracking-widest active:scale-95 transition shadow-2xl`}>Execute</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
