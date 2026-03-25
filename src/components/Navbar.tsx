import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PackageSearch, User, LogOut, Search, MessageSquare, Sun, Moon, Bell, Check, Trash2, Info } from "lucide-react";
import { useTheme } from "next-themes";

interface SessionUser { id: string; name?: string; email: string; role: string; }
interface Notification { id: string; title: string; message: string; isRead: boolean; createdAt: string; }

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) setNotifications(await res.json());
    } catch (e) {}
  };

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me", { cache: "no-store" })
      .then(r => r.ok ? r.json() : { user: null })
      .then(d => { 
        setUser(d.user || null); 
        setLoading(false); 
        if (d.user) fetchNotifications();
      })
      .catch(() => setLoading(false));
      
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard?q=${encodeURIComponent(searchQuery)}`);
    }
  }

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ id }) });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const deleteNotification = async (id: string) => {
    await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 border-b ${scrolled ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-zinc-100 dark:border-zinc-800 shadow-sm py-2" : "bg-transparent border-transparent py-4"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="h-9 w-9 bg-zinc-900 dark:bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <PackageSearch className="h-5 w-5 text-white dark:text-black" />
          </div>
          <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase hidden sm:block">LostFound</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
          <input 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for items, categories, locations..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-200 dark:focus:border-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800/50 transition-all text-sm font-medium dark:text-white"
          />
        </form>

        <nav className="flex items-center gap-4 lg:gap-8 shrink-0">
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/report-lost" className="text-sm font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition uppercase tracking-widest">Report Lost</Link>
            <Link href="/report-found" className="text-sm font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition uppercase tracking-widest">Report Found</Link>
            <Link href="/contact" className="text-sm font-black text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition uppercase tracking-widest flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Contact</Link>
          </div>

          <div className="h-6 w-px bg-zinc-100 dark:bg-zinc-800 hidden lg:block" />

          {/* Theme Toggle */}
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
          >
            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {user && (
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all relative active:scale-95"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Alerts Center</span>
                    <button onClick={() => setShowNotifications(false)} className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 dark:hover:text-white uppercase">Close</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-12 text-center text-zinc-400">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-medium">No alerts yet</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-zinc-50 dark:border-zinc-800 transition-colors ${n.isRead ? "opacity-60" : "bg-zinc-50/50 dark:bg-zinc-800/30"}`}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-black text-zinc-900 dark:text-white">{n.title}</h4>
                            <div className="flex gap-2">
                              {!n.isRead && (
                                <button onClick={() => markAsRead(n.id)} className="text-zinc-400 hover:text-green-500 transition-colors">
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              <button onClick={() => deleteNotification(n.id)} className="text-zinc-400 hover:text-red-500 transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">{n.message}</p>
                          <span className="text-[9px] font-black text-zinc-400 uppercase">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {loading ? (
            <div className="h-10 w-24 rounded-xl bg-zinc-100 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              {user.role === "ADMIN" ? (
                 <Link href="/admin" className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform active:scale-95">Admin Hub</Link>
              ) : (
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xs text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">{user.name?.[0] || user.email[0].toUpperCase()}</div>
                  <span className="text-sm font-black text-zinc-900 dark:text-white hidden md:block">{user.name?.split(' ')[0] || "Dashboard"}</span>
                </Link>
              )}
              <button onClick={logout} className="p-2.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group" title="Logout">
                <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-black text-zinc-900 dark:text-white px-4 transition uppercase tracking-widest">Sign In</Link>
              <Link href="/register" className="px-6 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform active:scale-95">Free Access</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
