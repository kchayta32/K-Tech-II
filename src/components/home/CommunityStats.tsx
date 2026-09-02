"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  Sparkles,
  Star,
  Github,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Flame,
  Code2,
  Copy,
  Check,
} from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  track: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "ภัทรดนัย พิริยะกิจ",
    role: "Senior Fullstack Engineer",
    company: "Fintech Unicorn",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    content: "คอร์ส Svelte 5 และ NestJS CQRS บน K-Tech ละเอียดมาก เทียบเท่าคอร์สระดับสากลหลักพันเหรียญ แต่ที่นี่เปิดให้เรียนฟรี มี Sandbox ในเว็บให้กดลองรันได้ทันที",
    track: "Frontend & Backend",
    rating: 5,
  },
  {
    name: "ศิริพร บุญโสภณ",
    role: "Lead Data Engineer",
    company: "E-Commerce Enterprise",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    content: "คอร์ส Apache Kafka Real-time Streaming อธิบายเรื่อง Exactly-Once Semantics และ Partitioning ได้เข้าใจง่ายที่สุดที่เคยเรียนมา ช่วยให้ระบบ Production ของเราเสถียรขึ้นมาก",
    track: "Data & Event Streaming",
    rating: 5,
  },
  {
    name: "อัศวิน เจริญฤทธิ์",
    role: "AI Application Specialist",
    company: "Tech Innovation Lab",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    content: "ชอบส่วน Interactive AI Agent Lab ที่เขียน LangChain และต่อ Vector DB ในเบราว์เซอร์ได้เลย เป็น MOOC สัญชาติไทยที่ยกระดับมาตรฐานวงการ Dev จริงๆ ครับ",
    track: "AI & Machine Learning",
    rating: 5,
  },
];

export default function CommunityStats() {
  const [certCopied, setCertCopied] = useState(false);
  const sampleCertId = "KT-SVE-2026-X94B";

  const handleCopyCertId = () => {
    navigator.clipboard.writeText(sampleCertId);
    setCertCopied(true);
    setTimeout(() => setCertCopied(false), 2000);
  };

  return (
    <section className="w-full py-16 sm:py-24 relative bg-[#090d16] border-t border-slate-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>GLOBAL LEARNER COMMUNITY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ชุมชนผู้เรียนและผลลัพธ์ที่พิสูจน์ได้จริง
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            ผู้เรียนกว่าหมื่นคนร่วมกันพัฒนาทักษะวิศวกรรมคอมพิวเตอร์ผ่านแพลตฟอร์มเปิดที่ขับเคลื่อนด้วยมาตรฐานสากล
          </p>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-center space-y-1 shadow-lg">
            <p className="text-3xl sm:text-4xl font-black font-mono bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
              15,400+
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              ผู้เรียนที่ลงทะเบียน
            </p>
            <p className="text-[11px] text-slate-500">Active Learners Globally</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-center space-y-1 shadow-lg">
            <p className="text-3xl sm:text-4xl font-black font-mono bg-gradient-to-r from-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              98.6%
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              ความพึงพอใจของผู้เรียน
            </p>
            <p className="text-[11px] text-slate-500">จาก 3,800+ แบบประเมิน</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-center space-y-1 shadow-lg">
            <p className="text-3xl sm:text-4xl font-black font-mono bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              4,800+
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              ใบประกาศนียบัตรที่ออกให้
            </p>
            <p className="text-[11px] text-slate-500">Cryptographically Verified</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/90 text-center space-y-1 shadow-lg">
            <p className="text-3xl sm:text-4xl font-black font-mono bg-gradient-to-r from-pink-300 to-purple-400 bg-clip-text text-transparent">
              100%
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-200">
              เปิดให้เรียนฟรีตลอดชีพ
            </p>
            <p className="text-[11px] text-slate-500">No Paywalls, Open Access</p>
          </div>
        </div>

        {/* Certificate Preview & Testimonials Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Left Column: Testimonials */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>เสียงตอบรับจากผู้เรียนจริงในวงการ</span>
            </h3>

            <div className="space-y-4">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 space-y-3 shadow-md hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-100">
                          {t.name}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          {t.role} • {t.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                    "{t.content}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="font-mono text-cyan-400">แทร็ก: {t.track}</span>
                    <span className="flex items-center gap-1 text-teal-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Verified Student
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Digital Certificate Preview */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/40 p-6 shadow-2xl shadow-amber-500/10 glow-teal">
              {/* Certificate Watermark / Cyber Glow */}
              <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED CREDENTIAL
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl text-amber-300 font-serif font-black">
                    🏆
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                      K-TECH ACADEMY CERTIFICATE
                    </p>
                    <h4 className="text-base font-extrabold text-white">
                      ใบประกาศนียบัตรสำเร็จการศึกษา
                    </h4>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                  <p className="text-[11px] text-slate-400">มอบให้แก่:</p>
                  <p className="text-base font-bold text-cyan-300">
                    กิตติภพ ชัยประเสริฐศิลป์ (Distinction)
                  </p>
                  <p className="text-xs text-slate-300">
                    สำเร็จหลักสูตร: <strong>Svelte 5 & SvelteKit Fullstack Mastery</strong>
                  </p>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>รหัสตรวจสอบ (Verification ID):</span>
                    <span className="text-amber-400 font-bold">{sampleCertId}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>เกรดผลการเรียน:</span>
                    <span className="text-teal-400 font-bold">เกียรตินิยม (100% Score)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleCopyCertId}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                  >
                    {certCopied ? (
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{certCopied ? "คัดลอกรหัสแล้ว!" : "คัดลอกรหัสตรวจสอบ"}</span>
                  </button>

                  <Link
                    href="/dashboard?tab=certificates"
                    className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>ดูใบรับรองของคุณ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Banner / CTA (GitHub & Discord) */}
        <div className="rounded-3xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                ร่วมสร้างและพัฒนาแพลตฟอร์มการเรียนรู้ไปด้วยกัน
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                K-Tech เป็นโครงการ Open Source 100% ร่วมส่งบทเรียน, รายงานข้อผิดพลาด, หรือเสนอแนวคิดผ่าน GitHub Repository
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href="https://github.com/kchayta32/K-Tech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all shadow-md"
              >
                <Github className="w-4 h-4" />
                <span>Star on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <Link
                href="/courses"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 transition-all shadow-md shadow-cyan-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>เริ่มเรียนฟรีทันที</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
