"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Lock,
  PlayCircle,
  BookOpen,
  Code2,
  HelpCircle,
  Rocket,
  Award,
  BookMarked,
  ArrowLeft,
  Flame,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Course, CourseModule, Lesson } from "@/types";
import { useProgress } from "@/lib/progress-context";
import { cn, formatTime } from "@/lib/utils";

interface ClassroomSidebarProps {
  course: Course;
  currentLessonId: string;
  onSelectLesson?: (lessonId: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function ClassroomSidebar({
  course,
  currentLessonId,
  onSelectLesson,
  isOpen = true,
  onToggle,
}: ClassroomSidebarProps) {
  const { isLessonCompleted, getCourseProgress, isBookmarked, toggleBookmark } = useProgress();

  // Calculate total lessons in course
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const progressPercent = getCourseProgress(course.id, totalLessons);

  // Default expand the module that contains the current active lesson
  const currentModuleId =
    course.modules.find((m) =>
      m.lessons.some((l) => l.id === currentLessonId)
    )?.id || course.modules[0]?.id;

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    [currentModuleId]: true,
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const getLessonIcon = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return <PlayCircle className="w-4 h-4 text-sky-400 shrink-0" />;
      case "reading":
        return <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />;
      case "interactive_code":
        return <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />;
      case "project":
        return <Rocket className="w-4 h-4 text-pink-400 shrink-0" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  const getLessonTypeLabel = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return "วิดีโอ";
      case "reading":
        return "บทความ";
      case "interactive_code":
        return "โค้ดแล็บ";
      case "quiz":
        return "แบบทดสอบ";
      case "project":
        return "โครงงาน";
    }
  };

  // Find index of completed lessons to calculate locked/unlocked state
  let previousLessonCompleted = true;

  if (!isOpen) {
    return (
      <div className="hidden lg:flex flex-col items-center py-4 px-2 border-r border-slate-800/80 bg-slate-950/70 backdrop-blur-md w-16 shrink-0 transition-all duration-300">
        <button
          onClick={onToggle}
          title="เปิดแถบเนื้อหา (Open Sidebar)"
          className="p-2.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
        <div className="mt-8 flex flex-col items-center gap-4 text-xs font-mono text-cyan-400">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-500/30 flex items-center justify-center font-bold bg-cyan-950/40">
            {progressPercent}%
          </div>
          <span className="rotate-90 whitespace-nowrap text-slate-400 mt-6 tracking-wider">
            เนื้อหาหลักสูตร
          </span>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-80 xl:w-96 flex flex-col h-full bg-slate-950/80 border-r border-slate-800/80 backdrop-blur-xl shrink-0 select-none z-20">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Link
            href={`/courses/${course.slug || course.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>กลับหน้าหลักสูตร</span>
          </Link>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleBookmark(course.id)}
              title={isBookmarked(course.id) ? "บันทึกแล้ว" : "บุ๊กมาร์กหลักสูตร"}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                isBookmarked(course.id)
                  ? "text-amber-400 bg-amber-400/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              )}
            >
              <BookMarked className="w-4 h-4" />
            </button>
            {onToggle && (
              <button
                onClick={onToggle}
                className="hidden lg:flex p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="ย่อแถบข้าง"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <h1 className="text-base font-bold text-slate-100 line-clamp-2 leading-snug">
          {course.title}
        </h1>

        {/* Progress Bar */}
        <div className="mt-3.5">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-400 flex items-center gap-1">
              ความคืบหน้าการเรียน
              {progressPercent === 100 && (
                <span className="text-emerald-400 text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                  เรียนจบแล้ว 🎉
                </span>
              )}
            </span>
            <span className="text-cyan-400 font-mono font-bold">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-brand-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module & Lesson List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 custom-scrollbar">
        {course.modules.map((module, mIdx) => {
          const isExpanded = !!expandedModules[module.id];
          const completedCount = module.lessons.filter((l) =>
            isLessonCompleted(course.id, l.id)
          ).length;
          const isModuleComplete =
            completedCount === module.lessons.length && module.lessons.length > 0;

          return (
            <div
              key={module.id}
              className={cn(
                "rounded-xl border transition-all duration-200 overflow-hidden",
                isExpanded
                  ? "bg-slate-900/70 border-slate-800 shadow-lg shadow-black/20"
                  : "bg-slate-900/30 border-slate-800/60 hover:border-slate-700/80"
              )}
            >
              {/* Module Accordion Header */}
              <button
                type="button"
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-3.5 text-left transition-colors hover:bg-slate-800/40"
              >
                <div className="flex items-start gap-2.5 min-w-0 pr-2">
                  <span
                    className={cn(
                      "w-5 h-5 rounded-full text-[11px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5",
                      isModuleComplete
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    )}
                  >
                    {isModuleComplete ? <Check className="w-3 h-3" /> : mIdx + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold text-slate-200 line-clamp-1 leading-snug">
                      {module.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                      <span>
                        {completedCount}/{module.lessons.length} บท
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-cyan-400 transition-transform" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Module Lessons Accordion Body */}
              {isExpanded && (
                <div className="px-2 pb-2.5 pt-1 space-y-1 border-t border-slate-800/50">
                  {module.lessons.map((lesson, lIdx) => {
                    const isCompleted = isLessonCompleted(course.id, lesson.id);
                    const isCurrent = lesson.id === currentLessonId;

                    // Allow free navigation or lock if previous isn't done (optional strictly open for learning)
                    const isLocked = false; 

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => {
                          if (!isLocked && onSelectLesson) {
                            onSelectLesson(lesson.id);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all relative group text-xs",
                          isCurrent
                            ? "bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                            : isCompleted
                            ? "hover:bg-slate-800/60 text-slate-300"
                            : "hover:bg-slate-800/40 text-slate-400"
                        )}
                      >
                        {/* Status Icon */}
                        <div className="shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
                          ) : isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-slate-600" />
                          ) : (
                            getLessonIcon(lesson.type)
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn(
                                "truncate font-medium",
                                isCurrent ? "text-cyan-100 font-semibold" : ""
                              )}
                            >
                              {lesson.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="text-slate-400">
                              {getLessonTypeLabel(lesson.type)}
                            </span>
                            <span>•</span>
                            <span>{formatTime(lesson.durationMinutes)}</span>
                          </div>
                        </div>

                        {/* Active Indicator Pulse */}
                        {isCurrent && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>สำเร็จรับ 50 XP/บท</span>
        </div>
        <div className="flex items-center gap-1 text-cyan-400 font-mono text-[11px]">
          <Award className="w-3.5 h-3.5" />
          <span>ใบเซอร์ฯ หลังจบคอร์ส</span>
        </div>
      </div>
    </aside>
  );
}
