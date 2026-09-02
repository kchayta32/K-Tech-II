"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Github,
  ExternalLink,
  Code2,
  Sparkles,
  BookOpen,
  Terminal,
  Compass,
  Award,
  ShieldCheck,
  CheckCircle2,
  Send,
  Heart,
  Cpu,
  Layers,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#060911] border-t border-slate-800/80 text-slate-400 text-sm mt-auto relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-teal-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-mono font-black text-lg bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    K
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">
                  K-Tech
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded">
                  OPEN MOOC
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              แพลตฟอร์มการเรียนรู้วิทยาการคอมพิวเตอร์และวิศวกรรมซอฟต์แวร์ขั้นสูง สไตล์ Futuristic MOOC พร้อม Interactive Code Runner, แบบฝึกหัดโต้ตอบเสมือนจริง และระบบออกใบรับรอง
            </p>

            {/* Platform Highlights Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                100% Free & Open Source
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 border border-slate-800 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                K-Bot AI Tutor Built-in
              </span>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                รับข่าวสารและหลักสูตรใหม่ก่อนใคร
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>ขอบคุณสำหรับการติดตาม! เราจะแจ้งเตือนเมื่อมีหลักสูตรใหม่</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ใส่อีเมลของคุณ..."
                    required
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>สมัคร</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Learning Tracks */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              เส้นทางการเรียนรู้ (Tracks)
            </p>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/courses?category=${cat.id}`}
                    className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    <span>{cat.nameEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive Tools & Features */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              ฟีเจอร์และเครื่องมือ
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/playground" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Code Playground & Runner</span>
                </Link>
              </li>
              <li>
                <Link href="/roadmaps" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Interactive Visual Roadmaps</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=certificates" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>ระบบใบประกาศนียบัตรดิจิทัล</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>XP & Level Tracking Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Source Code & Deployment links */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              โอเพนซอร์สและการเผยแพร่
            </p>
            <div className="space-y-2.5 text-xs">
              <a
                href="https://github.com/kchayta32/K-Tech"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all group"
              >
                <Github className="w-4 h-4 text-slate-400 group-hover:text-white" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs">GitHub Repository</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">
                    kchayta32/K-Tech
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <a
                href="https://k-tech.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all group"
              >
                <div className="w-4 h-4 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-[10px]">
                  ▲
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs">Vercel Deployment</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">
                    k-tech.vercel.app
                  </p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Systems Operational (99.99%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} K-Tech Academy. All rights reserved. Created for learners worldwide.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              นโยบายความเป็นส่วนตัว
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              ข้อกำหนดการใช้งาน
            </Link>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> and Next.js 14
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
