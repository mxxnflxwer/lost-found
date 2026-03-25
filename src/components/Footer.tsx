"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, PackageSearch } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-900 pt-16 pb-8 px-4 border-t border-zinc-800">
      <div className="mx-auto max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <PackageSearch className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-black text-white tracking-tight uppercase">Lost & Found</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              A community-driven recovery ecosystem leveraging smart algorithms to bring lost items back home.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-[11px] font-black uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-zinc-500 hover:text-white text-sm transition font-medium">Home</Link></li>
              <li><Link href="/report-lost" className="text-zinc-500 hover:text-white text-sm transition font-medium">Report Lost</Link></li>
              <li><Link href="/report-found" className="text-zinc-500 hover:text-white text-sm transition font-medium">Report Found</Link></li>
              <li><Link href="/contact" className="text-zinc-500 hover:text-white text-sm transition font-medium">Contact / Enquiry</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white text-[11px] font-black uppercase tracking-widest">Connect</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-zinc-500 text-sm font-medium">
                <Mail className="h-4 w-4 text-zinc-700" /> mathimalar@lostfound.app
              </li>
              <li className="flex items-center gap-3 text-zinc-500 text-sm font-medium">
                <Phone className="h-4 w-4 text-zinc-700" /> +91 7305157247
              </li>
              <li className="flex items-center gap-3 text-zinc-500 text-sm font-medium">
                <MapPin className="h-4 w-4 text-zinc-700" /> Global Recovery Hub
              </li>
            </ul>
          </div>

          {/* Copyright Section */}
          <div className="space-y-4">
            <h4 className="text-white text-[11px] font-black uppercase tracking-widest">Platform Status</h4>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Operational</span>
            </div>
            <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest leading-normal">
              SECURE AES-256 <br /> CLOUD STORAGE ACTIVATED
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
            © {currentYear} LOST & FOUND MANAGEMENT SYSTEM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
             <Link href="#" className="text-zinc-600 hover:text-zinc-400 text-[9px] font-black uppercase tracking-widest transition">Privacy Policy</Link>
             <Link href="#" className="text-zinc-600 hover:text-zinc-400 text-[9px] font-black uppercase tracking-widest transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
