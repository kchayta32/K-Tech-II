"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  BookOpen,
  ArrowRight,
  Sparkles,
  Clock,
  Zap,
  Layers,
  CheckCircle2,
  Compass,
  Terminal,
} from "lucide-react";
import { COURSES } from "@/data/courses";
import { CATEGORIES } from "@/data/categories";

export default function SearchModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K & Escape & Custom Event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-ktech-search", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-ktech-search", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
      setSelectedCategory("all");
    }
  }, [isOpen]);

  // Filter courses based on query and selectedCategory
  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COURSES.filter((course) => {
      const matchCategory =
        selectedCategory === "all" || course.categoryId === selectedCategory;
      if (!matchCategory) return false;

      if (!q) return true;

      const titleMatch = course.title.toLowerCase().includes(q);
      const titleEnMatch = course.titleEn.toLowerCase().includes(q);
      const descMatch = course.description.toLowerCase().includes(q);
      const taglineMatch = course.tagline.toLowerCase().includes(q);
      const tagMatch = course.tags.some((t) => t.toLowerCase().includes(q));
      const instructorMatch = course.instructor.name.toLowerCase().includes(q);

      return (
        titleMatch ||
        titleEnMatch ||
        descMatch ||
        taglineMatch ||
        tagMatch ||
        instructorMatch
      );
    });
  }, [query, selectedCategory]);

  // Keyboard arrow navigation
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCourses.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCourses.length - 1
      );
    } else if (e.key === "Enter" && filteredCourses[selectedIndex]) {
      e.preventDefault();
      navigateToCourse(filteredCourses[selectedIndex].slug);
    }
  };

  const navigateToCourse = (slug: string) => {
    setIsOpen(false);
    router.push(`/courses/${slug}`);
  };

  const getCategoryName = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.nameEn : catId;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header Search Input */}
          <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/70">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="ค้นหาตามชื่อคอร์ส, เทคโนโลยี (TypeScript, Svelte, Kafka, Docker, PyTorch)..."
              className="w-full bg-transparent px-3 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 rounded border border-slate-700">
              ESC
            </kbd>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/80 bg-slate-950/40 overflow-x-auto text-xs no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              ทั้งหมด ({COURSES.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {cat.nameEn}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            className="max-h-[55vh] overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40"
          >
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={course.id}
                    onClick={() => navigateToCourse(course.slug)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "bg-slate-800 border border-cyan-500/40 shadow-md"
                        : "hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1 pr-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-lg shrink-0">
                        {course.badgeIcon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h4
                            className={`text-sm font-semibold truncate ${
                              isSelected ? "text-cyan-300" : "text-slate-100"
                            }`}
                          >
                            {course.title}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-900 border border-slate-700 text-slate-400">
                            {getCategoryName(course.categoryId)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {course.tagline}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {course.estimatedHours} ชั่วโมง
                          </span>
                          <span className="text-teal-400 font-medium">
                            ★ {course.rating.toFixed(2)}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {course.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-cyan-400">
                      <span className="hidden sm:inline-block">เข้าเรียน</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-300">
                  ไม่พบผลการค้นหาสำหรับ "{query}"
                </p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  ลองค้นหาด้วยคำค้นอื่น เช่น Svelte, TypeScript, gRPC, Kafka, Docker หรือเลือกหมวดหมู่อื่น
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer Quick Shortcuts */}
          <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">↓</kbd>
                <span>เลือกรายการ</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">↵</kbd>
                <span>เปิดคอร์ส</span>
              </span>
            </div>
            <span className="text-cyan-400 font-mono">
              {filteredCourses.length} คอร์สพร้อมเรียนฟรี
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
