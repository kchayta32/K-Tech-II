"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Compass, 
  Layers, 
  Code2, 
  Cpu, 
  Database, 
  Cloud, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Award
} from "lucide-react";
import { roadmapTracks, getCourseById } from "@/data";
import { useProgress } from "@/lib/progress-context";

export default function RoadmapsPage() {
  const [activeTrackId, setActiveTrackId] = useState<string>(roadmapTracks[0].id);
  const activeTrack = roadmapTracks.find((t) => t.id === activeTrackId) || roadmapTracks[0];

  const { isEnrolled, getCourseProgress } = useProgress();

  const getTrackIcon = (id: string) => {
    switch (id) {
      case "frontend-architect": return <Code2 className="w-5 h-5 text-orange-400" />;
      case "backend-architect": return <Layers className="w-5 h-5 text-rose-400" />;
      case "data-engineer-track": return <Database className="w-5 h-5 text-blue-400" />;
      case "ai-ml-specialist": return <Cpu className="w-5 h-5 text-emerald-400" />;
      case "devops-cloud-architect": return <Cloud className="w-5 h-5 text-indigo-400" />;
      default: return <Compass className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            <Compass className="w-4 h-4" />
            <span>Interactive Learning Career Paths</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            แผนผังเส้นทางสู่ความเป็นมืออาชีพ <span className="gradient-text">(Career Roadmaps)</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            เลือกสายงานที่คุณต้องการมุ่งเน้น ติดตามลำดับทักษะที่ต้องรู้ และเข้าสู่คอร์สเรียนที่ตรงกับแต่ละหมุดหมาย
          </p>
        </div>

        {/* Track Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {roadmapTracks.map((track) => {
            const isSelected = track.id === activeTrackId;
            return (
              <button
                key={track.id}
                onClick={() => setActiveTrackId(track.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-slate-900 border-teal-500/80 shadow-lg shadow-teal-500/10 ring-1 ring-teal-500/50"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                    {track.icon}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  )}
                </div>
                <div>
                  <h3 className={`text-xs sm:text-sm font-bold leading-snug mb-1 ${
                    isSelected ? "text-white" : "text-slate-300"
                  }`}>
                    {track.title.replace("เส้นทางสู่ ", "")}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{track.targetRole}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Track Overview & Details */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getTrackIcon(activeTrack.id)}
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                  {activeTrack.titleEn}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activeTrack.title}
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                {activeTrack.description}
              </p>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-300 shrink-0">
              <div className="text-slate-400 mb-1">เป้าหมายตำแหน่งงาน:</div>
              <div className="font-bold text-teal-300 text-sm">{activeTrack.targetRole}</div>
              <div className="mt-2 text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>มีทั้งหมด {activeTrack.nodes.length} ระดับการเรียนรู้</span>
              </div>
            </div>
          </div>

          {/* Vertical Roadmap Tree Nodes */}
          <div className="pt-8 relative">
            {/* Center connecting line */}
            <div className="absolute left-6 sm:left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-teal-500 via-cyan-400 to-purple-500 hidden sm:block" />

            <div className="space-y-8">
              {activeTrack.nodes.map((node, idx) => {
                const linkedCourse = node.courseId ? getCourseById(node.courseId) : null;
                const totalLessons = linkedCourse ? linkedCourse.modules.reduce((a, m) => a + m.lessons.length, 0) : 0;
                const progress = linkedCourse ? getCourseProgress(linkedCourse.id, totalLessons) : 0;

                return (
                  <div key={node.id} className="relative sm:pl-20">
                    {/* Node Circle Badge on vertical line */}
                    <div className="hidden sm:flex absolute left-4 -translate-x-1/2 top-6 w-8 h-8 rounded-full bg-slate-950 border-2 border-teal-400 items-center justify-center text-xs font-bold text-teal-300 shadow-lg shadow-teal-500/30 z-10">
                      {node.level}
                    </div>

                    {/* Node Content Card */}
                    <div className="bg-slate-950/80 border border-slate-800/80 hover:border-teal-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                              Level {node.level}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                              {node.category}
                            </span>
                            {progress === 100 && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                ผ่านแล้ว
                              </span>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-white mb-2">
                            {node.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
                            {node.description}
                          </p>
                        </div>

                        {/* Linked Course Action */}
                        <div className="shrink-0">
                          {linkedCourse ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                              {progress > 0 && (
                                <div className="text-xs text-slate-400">
                                  <span>ความคืบหน้า: </span>
                                  <span className="text-teal-400 font-bold">{progress}%</span>
                                </div>
                              )}
                              <Link
                                href={`/courses/${linkedCourse.slug || linkedCourse.id}`}
                                className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-teal-500/10 flex items-center gap-1.5"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>เข้าเรียนคอร์สนี้ ({linkedCourse.title.split(":")[0]})</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-500 font-medium">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>เนื้อหาขั้นสูง (Specialized Milestone)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
