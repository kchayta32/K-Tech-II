"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  PlayCircle,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  Zap,
} from "lucide-react";
import { roadmapTracks } from "@/data/roadmaps";
import { RoadmapNode } from "@/types";

export default function RoadmapOverview() {
  const [activeTrackId, setActiveTrackId] = useState<string>("frontend-architect");
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  const activeTrack =
    roadmapTracks?.find((t) => t.id === activeTrackId) || roadmapTracks?.[0];

  const getNodeStatusBadge = (status?: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" /> สำเร็จแล้ว
          </span>
        );
      case "in_progress":
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded-full">
            <PlayCircle className="w-3 h-3" /> กำลังเรียน
          </span>
        );
      case "locked":
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full">
            <Lock className="w-3 h-3" /> ต้องผ่านวิชาก่อน
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3" /> พร้อมเรียน
          </span>
        );
    }
  };

  return (
    <section className="w-full py-16 sm:py-24 relative bg-[#070a12] border-t border-slate-800/80 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>STRUCTURED CAREER PATHS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              แผนผังเส้นทางสู่ความเป็นเลิศ (Learning Roadmaps)
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              เรียนรู้แบบเป็นลำดับขั้นตอน ปูพื้นฐานสู่สถาปัตยกรรมระดับสูง ไม่ต้องเดาว่าควรเริ่มเรียนอะไรต่อ
            </p>
          </div>

          <Link
            href="/roadmaps"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>สำรวจ Roadmaps แบบเต็ม</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Track Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {roadmapTracks.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => {
                setActiveTrackId(track.id);
                setSelectedNode(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                activeTrackId === track.id
                  ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/50 shadow-lg shadow-purple-500/10 font-bold"
                  : "text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800"
              }`}
            >
              <Compass
                className={`w-4 h-4 ${
                  activeTrackId === track.id ? "text-purple-400" : "text-slate-500"
                }`}
              />
              <span>{track.titleEn}</span>
            </button>
          ))}
        </div>

        {/* Track Info Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 mb-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {activeTrack.title}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                  Target: {activeTrack.targetRole}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                {activeTrack.description}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 font-mono">
                {activeTrack.nodes.length} ลำดับการเรียนรู้
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Roadmap Step Tree */}
        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-6 sm:left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-indigo-500/30 hidden sm:block" />

          <div className="space-y-4">
            {activeTrack.nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                  className="relative sm:pl-16"
                >
                  {/* Step Node Dot */}
                  <div className="absolute left-6 sm:left-6 top-6 -translate-x-1/2 w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-400 hidden sm:flex z-10">
                    {index + 1}
                  </div>

                  {/* Step Card */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 border-cyan-500/60 shadow-xl shadow-cyan-500/10"
                        : "bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-bold text-cyan-400">
                            LEVEL {node.level}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400 font-medium">
                            {node.category}
                          </span>
                          {getNodeStatusBadge(node.status)}
                        </div>
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          {node.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-400">
                          {node.description}
                        </p>
                      </div>

                      {/* Course Jump Button */}
                      {node.courseId && (
                        <div className="shrink-0 pt-2 sm:pt-0">
                          <Link
                            href={`/courses/${node.courseId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>เรียนวิชานี้</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
