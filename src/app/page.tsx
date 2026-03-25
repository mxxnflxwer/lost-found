"use client";

import Link from "next/link";
import { 
  PackageSearch, ShieldCheck, Zap, Heart, Search, 
  ArrowRight, CheckCircle2, Globe, Users, History,
  MapPin, Clock, TrendingUp
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background selection:bg-zinc-900 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-100/50 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-12 relative">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest shadow-2xl">
               <Zap className="h-3 w-3 fill-white" /> AI Matching Active
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-zinc-900 tracking-tighter leading-[0.9] uppercase">
              Lost today. <br /> 
              <span className="text-zinc-400">Found tomorrow.</span>
            </h1>
            
            <p className="text-xl text-zinc-500 font-medium max-w-xl leading-relaxed">
              The world's most advanced recovery ecosystem. Leveraging smart algorithms and community verification to bring your belongings back home.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/report-lost" className="px-10 py-5 rounded-2xl bg-zinc-900 text-white font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                Report Lost Item <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/report-found" className="px-10 py-5 rounded-2xl border border-zinc-200 bg-white text-zinc-900 font-black text-xs uppercase tracking-widest hover:bg-zinc-50 hover:shadow-xl transition-all flex items-center justify-center gap-2">
                I Found Something
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Stats Radar */}
        <div className="hidden lg:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-[40%] animate-in fade-in zoom-in duration-1000 delay-300">
          <div className="relative aspect-square">
             <div className="absolute inset-0 border-[40px] border-zinc-50 rounded-full animate-pulse" />
             <div className="absolute inset-[80px] border-[20px] border-zinc-50 rounded-full" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-12 bg-white rounded-[3rem] shadow-2xl border border-zinc-100 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white"><CheckCircle2 className="h-6 w-6" /></div>
                      <div>
                         <p className="text-2xl font-black text-zinc-900">14,202</p>
                         <p className="text-[10px] font-black uppercase text-zinc-400">Items Recovered</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white"><Globe className="h-6 w-6" /></div>
                      <div>
                         <p className="text-2xl font-black text-zinc-900">98.4%</p>
                         <p className="text-[10px] font-black uppercase text-zinc-400">Match Accuracy</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-zinc-50/50 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center mb-24 space-y-4">
            <h2 className="text-sm font-black text-zinc-400 uppercase tracking-[0.3em]">The Ecosystem</h2>
            <p className="text-4xl font-black text-zinc-900 tracking-tight">Built for speed. Secured by design.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Smart Matching", 
                desc: "Our algorithm cross-references category, location, and metadata to suggest instant matches.",
                icon: Zap,
                color: "bg-blue-50 text-blue-600"
              },
              { 
                title: "Strict Privacy", 
                desc: "Contact details are redacted and only shared once a match is manually verified by admins.",
                icon: ShieldCheck,
                color: "bg-zinc-900 text-white"
              },
              { 
                title: "Global Reach", 
                desc: "Connect with recovery hubs and community members across the entire platform network.",
                icon: Globe,
                color: "bg-white text-zinc-900 border-zinc-100"
              }
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-white border border-zinc-200 shadow-sm hover:shadow-2xl transition-all duration-500 translate-y-0 hover:-translate-y-4">
                <div className={`h-14 w-14 rounded-2xl ${f.color} flex items-center justify-center mb-8 shadow-xl group-hover:rotate-12 transition-transform`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 mb-4">{f.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* social feed / proofs */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-5xl font-black text-zinc-900 tracking-tighter leading-none uppercase">
                Trusted by 50k+ <br /> Platform Members
              </h2>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                Join a global community dedicated to making loss a temporary state. Our transparent reporting and verification workflow ensures items get where they belong.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                   <p className="text-4xl font-black text-zinc-900 mb-1">2.4k</p>
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Reports Weekly</p>
                </div>
                <div>
                   <p className="text-4xl font-black text-zinc-900 mb-1">12m</p>
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Avg. Resolution</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="p-8 rounded-[3.5rem] bg-zinc-900 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-40">Live Security Feed</h3>
                <div className="space-y-4">
                   {[
                     { item: "Black Leather Wallet", loc: "Central Mall", time: "2 min ago", icon: CheckCircle2, status: "MATCHED" },
                     { item: "Apple AirPods Pro", loc: "City Subway", time: "15 min ago", icon: History, status: "RESOLVED" },
                     { item: "Silver Watch", loc: "Airport T2", time: "1 hour ago", icon: Clock, status: "MATCHED" },
                   ].map((feed, i) => (
                     <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center"><feed.icon className="h-5 w-5 text-emerald-500" /></div>
                           <div>
                              <p className="text-white font-bold text-sm leading-none mb-1">{feed.item}</p>
                              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {feed.loc}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-white px-2 py-1 rounded bg-white/10 mb-1">{feed.status}</p>
                           <p className="text-[9px] text-white/20 font-black tracking-widest uppercase">{feed.time}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-5xl rounded-[4rem] bg-zinc-900 py-24 px-12 text-center relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 via-transparent to-transparent pointer-events-none" />
           <div className="relative z-10 space-y-8">
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none">
                Start your recovery <br /> journey today.
              </h2>
              <p className="text-zinc-400 text-lg font-medium max-w-xl mx-auto">
                Securely report lost items or register found ones. Our system works around the clock to reunite belongings with their owners.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                 <Link href="/register" className="px-12 py-5 rounded-2xl bg-white text-zinc-900 font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform active:scale-95">Create Free Account</Link>
                 <Link href="/contact" className="px-12 py-5 rounded-2xl bg-white/5 text-white border border-white/10 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Speak with Support</Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
