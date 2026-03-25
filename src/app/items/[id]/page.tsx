"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PackageSearch, MapPin, CalendarDays, Tag, ShieldCheck, ArrowLeft, Mail, Phone, Clock } from "lucide-react";
import Link from "next/link";

interface Item {
  id: string; type: string; name: string; category: string;
  description: string; location: string; date: string; status: string;
  contactEmail: string; phone: string; imageUrl?: string;
  createdAt: string;
}

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/items/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { setItem(data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900" /></div>;
  if (!item) return <div className="pt-32 text-center text-zinc-500">Item not found</div>;

  const isMatched = item.status === "MATCHED" || item.status === "RESOLVED";

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-8 group font-black text-[10px] uppercase tracking-widest">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="aspect-square rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-border flex items-center justify-center relative shadow-2xl">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <PackageSearch className="h-20 w-20 text-zinc-200 dark:text-zinc-800" />
              )}
              <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em]">
                {item.type}
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-zinc-400 font-black text-[10px] uppercase tracking-[0.2em]">
                <Tag className="h-3 w-3" /> {item.category}
              </div>
              <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter leading-none">{item.name}</h1>
              <div className="flex items-center gap-2 pt-2">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  item.status === "RESOLVED" ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" :
                  item.status === "MATCHED" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" :
                  "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{item.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-border">
                  <MapPin className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{item.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-border">
                  <CalendarDays className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Reported on</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Security Notice / Contact */}
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-black text-[10px] uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-zinc-400" /> Security Protocol
              </div>
              {item.status === "RESOLVED" ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Match verified by Admin. Contact details are now available.</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-border shadow-sm">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-bold">{item.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-border shadow-sm">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-bold">{item.phone}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 italic">
                  Contact details are hidden for security. They will be shared privately once an Admin verifies the match and the case is marked as <span className="text-zinc-900 dark:text-white font-black">RESOLVED</span>.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
