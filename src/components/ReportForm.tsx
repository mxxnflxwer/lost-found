"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Tag, FileText, Mail, User, Phone, Image as ImageIcon, X } from "lucide-react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: "", category: "", description: "", location: "",
    date: new Date().toISOString().split("T")[0], 
    contactEmail: "", phone: "", imageUrl: "",
  });

  function setField(key: string, value: string) {
    if (key === "phone") {
       // Only allow digits, max 10
       const digits = value.replace(/\D/g, "").slice(0, 10);
       setForm(prev => ({ ...prev, [key]: digits }));
       return;
    }
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        setForm(prev => ({ ...prev, imageUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setPreview(null);
    setForm(prev => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

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
          <button onClick={() => { setSuccess(false); setForm({ name:"",category:"",description:"",location:"",date:new Date().toISOString().split("T")[0],contactEmail:"", phone: "", imageUrl: "" }); setPreview(null); }}
            className="px-5 py-2 rounded-lg border border-border text-sm font-medium text-primary hover:bg-zinc-50 transition">
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

  const labelClass = "text-[11px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-1.5";
  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-300 bg-white focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all border-zinc-200 focus:border-zinc-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className={labelClass}><User className="h-3 w-3" /> Item Name <span className="text-red-400">*</span></label>
          <input required placeholder="e.g. Blue Nike Backpack" value={form.name} onChange={e => setField("name", e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-1.5 ml-1">
            <Tag className="h-3.5 w-3.5" /> Category
          </label>
          <select required value={form.category} onChange={e => setField("category", e.target.value)} className="w-full px-5 py-3 rounded-2xl border border-border bg-background focus:bg-card focus:outline-none focus:ring-4 focus:ring-zinc-100 dark:focus:ring-zinc-800/50 transition-all font-medium text-sm">
            <option value="">Select Category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}><FileText className="h-3 w-3" /> Detailed Description <span className="text-red-400">*</span></label>
        <textarea required rows={3} placeholder="Describe markings, brand, model, unique features..." value={form.description} onChange={e => setField("description", e.target.value)} className={`${inputClass} resize-none bg-background dark:bg-zinc-900 border-border`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className={labelClass}><MapPin className="h-3 w-3" /> Location <span className="text-red-400">*</span></label>
          <input required placeholder="e.g. Science Block, Room 204" value={form.location} onChange={e => setField("location", e.target.value)} className={`${inputClass} bg-background dark:bg-zinc-900 border-border`} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}><CalendarDays className="h-3 w-3" /> Date <span className="text-red-400">*</span></label>
          <input type="date" required value={form.date} onChange={e => setField("date", e.target.value)} className={`${inputClass} bg-background dark:bg-zinc-900 border-border`} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className={labelClass}><Mail className="h-3 w-3" /> Contact Email <span className="text-red-400">*</span></label>
          <input type="email" required placeholder="name@example.com" value={form.contactEmail} onChange={e => setField("contactEmail", e.target.value)} className={`${inputClass} bg-background dark:bg-zinc-900 border-border`} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}><Phone className="h-3 w-3" /> Mobile Number <span className="text-red-400">*</span></label>
          <input 
            type="tel" 
            required 
            placeholder="10-digit number" 
            value={form.phone} 
            onChange={e => setField("phone", e.target.value)} 
            className={`${inputClass} bg-background dark:bg-zinc-900 border-border`} 
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className={labelClass}><ImageIcon className="h-3 w-3" /> Item Photo (Optional)</label>
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-border border-dashed rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Select Image
          </button>
          <input 
            type="file" 
            hidden 
            ref={fileInputRef} 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          {preview && (
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border">
               <img src={preview} alt="Preview" className="h-full w-full object-cover" />
               <button 
                 type="button" 
                 onClick={removeImage}
                 className="absolute top-0 right-0 bg-zinc-900/50 text-white p-0.5"
               >
                 <X className="h-3 w-3" />
               </button>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">{error}</p>}
      
      <button type="submit" disabled={loading}
        className="w-full py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98] transition-all disabled:opacity-60 shadow-xl">
        {loading ? "Processing..." : `Register ${type} Report`}
      </button>
    </form>
  );
}
