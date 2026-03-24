"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Tag, FileText, Mail, User } from "lucide-react";

const CATEGORIES = [
  "Electronics", "Wallet / Purse", "Keys", "Bags / Backpacks",
  "Clothing", "Jewelry / Accessories", "Documents / ID", "Books / Stationery",
  "Sports / Outdoor", "Toys", "Other",
];

interface ReportFormProps {
  type: "LOST" | "FOUND";
}

export default function ReportForm({ type }: ReportFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", category: "", description: "", location: "",
    date: new Date().toISOString().split("T")[0], contactEmail: "",
  });

  function setField(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type }),
      });
      const data = await res.json();
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) { setError(data.error || "Submission failed"); return; }
      setSuccess(true);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
          <svg className="h-8 w-8 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-primary">{type === "LOST" ? "Report submitted!" : "Thank you!"}</h2>
        <p className="text-muted max-w-sm">Your report has been submitted. We&apos;ll notify you if we find a match.</p>
        <div className="flex gap-3 mt-4">
          <button onClick={() => { setSuccess(false); setForm({ name:"",category:"",description:"",location:"",date:new Date().toISOString().split("T")[0],contactEmail:"" }); }}
            className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-primary hover:bg-primary/5 transition">
            Report another
          </button>
          <button onClick={() => router.push("/dashboard")}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
            View dashboard
          </button>
        </div>
      </div>
    );
  }

  const labelClass = "text-sm font-medium text-primary flex items-center gap-1.5";
  const inputClass = "w-full px-3 py-2 rounded-lg border border-border text-sm text-primary placeholder:text-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label className={labelClass} htmlFor="item-name"><User className="h-3.5 w-3.5" /> Item Name <span className="text-red-400">*</span></label>
        <input id="item-name" required placeholder="e.g. Blue Nike Backpack" value={form.name} onChange={e => setField("name", e.target.value)} className={inputClass} />
      </div>
      <div className="space-y-1">
        <label className={labelClass} htmlFor="category"><Tag className="h-3.5 w-3.5" /> Category <span className="text-red-400">*</span></label>
        <select id="category" required value={form.category} onChange={e => setField("category", e.target.value)} className={inputClass}>
          <option value="">Select a category...</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-1">
        <label className={labelClass} htmlFor="description"><FileText className="h-3.5 w-3.5" /> Description <span className="text-red-400">*</span></label>
        <textarea id="description" required rows={4} placeholder="Describe the item in detail — color, size, brand, distinguishing features..." value={form.description} onChange={e => setField("description", e.target.value)} className={`${inputClass} resize-none`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className={labelClass} htmlFor="location"><MapPin className="h-3.5 w-3.5" /> {type === "LOST" ? "Where lost?" : "Where found?"} <span className="text-red-400">*</span></label>
          <input id="location" required placeholder="e.g. Central Library, 2nd Floor" value={form.location} onChange={e => setField("location", e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="date"><CalendarDays className="h-3.5 w-3.5" /> Date <span className="text-red-400">*</span></label>
          <input id="date" type="date" required value={form.date} onChange={e => setField("date", e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="space-y-1">
        <label className={labelClass} htmlFor="contact"><Mail className="h-3.5 w-3.5" /> Contact Email <span className="text-red-400">*</span></label>
        <input id="contact" type="email" required placeholder="your@email.com" value={form.contactEmail} onChange={e => setField("contactEmail", e.target.value)} className={inputClass} />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 mt-2">
        {loading ? "Submitting..." : `Submit ${type === "LOST" ? "Lost" : "Found"} Report`}
      </button>
    </form>
  );
}
