"use client";

import { useState } from "react";
import { Mail, User, MessageCircle, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-24 pb-32 px-4 bg-background transition-colors duration-300">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
             Enquiry Support
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tight">Need assistance?</h1>
          <p className="text-zinc-500 font-medium max-w-xl mx-auto">
            Our team is here to help you navigate recovery. Submit an enquiry and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-2 space-y-8">
             <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-100 shadow-sm">
                <h3 className="text-lg font-black text-zinc-900 mb-6">Support Channels</h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Email</p>
                        <p className="font-bold text-zinc-900">mathimalar@lostfound.app</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                        <MessageCircle className="h-5 w-5 text-zinc-900" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Direct Contact</p>
                        <p className="font-bold text-zinc-900">Mathimalar: +91 7305157247</p>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white shadow-2xl">
                <h4 className="text-sm font-black uppercase tracking-widest mb-4">Official Notice</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  For critical security reports or if you suspect theft, please contact your local law enforcement directly.
                </p>
             </div>
          </div>

          <div className="md:col-span-3">
             <div className="bg-white rounded-[3rem] p-10 border border-zinc-100 shadow-sm">
               {success ? (
                 <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                    <CheckCircle2 className="h-16 w-16 text-zinc-900 mb-6" />
                    <h2 className="text-2xl font-black text-zinc-900 mb-2">Message Received!</h2>
                    <p className="text-zinc-500 font-medium mb-8">Your enquiry has been successfully submitted. <br /> Check your email for a response soon.</p>
                    <button onClick={() => setSuccess(false)} className="px-8 py-3 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition">Send Another</button>
                 </div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-1.5 ml-1">
                        <User className="h-3 w-3" /> Full Name
                      </label>
                      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your name" className="w-full px-5 py-3 rounded-2xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all font-medium text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-1.5 ml-1">
                        <Mail className="h-3 w-3" /> Email Address
                      </label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" className="w-full px-5 py-3 rounded-2xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all font-medium text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mb-1.5 ml-1">
                        <MessageCircle className="h-3 w-3" /> Your Message
                      </label>
                      <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="How can we help you today?" className="w-full px-5 py-4 rounded-2xl border border-zinc-100 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all font-medium text-sm resize-none" />
                    </div>
                    {error && <p className="text-red-500 text-xs font-bold px-2">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-zinc-900 text-white text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                      {loading ? "Transmitting..." : <>Transmit Message <Send className="h-3.5 w-3.5" /></>}
                    </button>
                 </form>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
