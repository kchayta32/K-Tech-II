"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Layout,
  Server,
  Database,
  Brain,
  Cloud,
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

const iconMap: Record<string, React.ReactNode> = {
  Layout: <Layout className="w-7 h-7 text-cyan-400" />,
  Server: <Server className="w-7 h-7 text-purple-400" />,
  Database: <Database className="w-7 h-7 text-emerald-400" />,
  Brain: <Brain className="w-7 h-7 text-pink-400" />,
  Cloud: <Cloud className="w-7 h-7 text-amber-400" />,
};

export default function CategoryGrid() {
  return (
    <section className="w-full py-16 sm:py-20 relative bg-[#070b14] border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CORE DISCIPLINES</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              5 สาขาวิชาเทคโนโลยีขั้นสูง
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
              เลือกเส้นทางการเรียนรู้ตามความสนใจและสายอาชีพ ออกแบบอย่างเป็นระบบเพื่อก้าวสู่ระดับ Senior & Lead Engineer
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>ดูรายวิชาทั้งหมด</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories 5-column / responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <Link
                href={`/courses?category=${cat.id}`}
                className="group relative flex flex-col justify-between h-full p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 hover:bg-slate-900 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 overflow-hidden"
              >
                {/* Top Accent Light */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cat.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                />

                <div className="space-y-4">
                  {/* Icon & Count Badge */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:scale-110 transition-transform duration-300">
                      {iconMap[cat.icon] || <Zap className="w-7 h-7 text-cyan-400" />}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-slate-800/90 border border-slate-700 text-slate-300">
                      {cat.courseCount} คอร์ส
                    </span>
                  </div>

                  {/* Title & En Title */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {cat.nameEn}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {cat.name}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Link CTA */}
                <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span>สำรวจคอร์สในแทร็ก</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
