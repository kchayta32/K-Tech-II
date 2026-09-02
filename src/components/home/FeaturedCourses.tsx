"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Star,
  Users,
  Bookmark,
  BookmarkCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  SlidersHorizontal,
  Zap,
} from "lucide-react";
import { COURSES } from "@/data/courses";
import { CATEGORIES } from "@/data/categories";
import { useProgress } from "@/lib/progress-context";
import { CourseDifficulty } from "@/types";

const DIFFICULTIES: CourseDifficulty[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export default function FeaturedCourses() {
  const { isBookmarked, toggleBookmark, isEnrolled, getCourseProgress } =
    useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");

  const filteredCourses = useMemo(() => {
    return COURSES.filter((c) => {
      const matchCat =
        selectedCategory === "all" || c.categoryId === selectedCategory;
      const matchDiff =
        selectedDifficulty === "all" || c.difficulty === selectedDifficulty;
      const matchSearch =
        !searchFilter ||
        c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.titleEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
        c.tags.some((t) =>
          t.toLowerCase().includes(searchFilter.toLowerCase())
        );
      return matchCat && matchDiff && matchSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchFilter]);

  const getDifficultyColor = (difficulty: CourseDifficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Intermediate":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "Advanced":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getCategoryBadge = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.nameEn : catId;
  };

  return (
    <section className="w-full py-16 sm:py-24 relative bg-[#090d16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FEATURED CURRICULUM</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              หลักสูตรยอดนิยมและเปิดเรียนทันที
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              คอร์สคุณภาพสูงที่มีแบบฝึกหัดโต้ตอบและการวัดผลอย่างละเอียด เรียนฟรีได้ทุกที่ทุกเวลา
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              พบ {filteredCourses.length} หลักสูตร
            </span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/90 mb-8 space-y-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                  : "text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              }`}
            >
              ทุกหมวดหมู่
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                    : "text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                }`}
              >
                {cat.nameEn}
              </button>
            ))}
          </div>

          {/* Sub Filters: Difficulty + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-900">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-mono hidden sm:inline">ระดับ:</span>
              <button
                type="button"
                onClick={() => setSelectedDifficulty("all")}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedDifficulty === "all"
                    ? "text-cyan-400 bg-slate-800 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ทั้งหมด
              </button>
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    selectedDifficulty === diff
                      ? "text-cyan-400 bg-slate-800 font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Quick Keyword Search */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="กรองด้วยชื่อ หรือ Tag..."
                className="w-full px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCourses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const progress = getCourseProgress(
                course.id,
                course.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1
              );
              const bookmarked = isBookmarked(course.id);

              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 p-5 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Header: Icon, Category & Bookmark Button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                          {course.badgeIcon}
                        </div>
                        <div>
                          <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                            {getCategoryBadge(course.categoryId)}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold ${getDifficultyColor(
                                course.difficulty
                              )}`}
                            >
                              {course.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleBookmark(course.id);
                        }}
                        className={`p-2 rounded-xl transition-colors ${
                          bookmarked
                            ? "text-purple-400 bg-purple-500/10 border border-purple-500/30"
                            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                        }`}
                        title={bookmarked ? "ยกเลิกบุ๊กมาร์ก" : "บันทึกคอร์สนี้"}
                      >
                        {bookmarked ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Course Title & Tagline */}
                    <div>
                      <Link href={`/courses/${course.slug}`}>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {course.tagline}
                      </p>
                    </div>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Enrolled Progress Bar (If Enrolled) */}
                    {enrolled && (
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-teal-500/20 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-teal-400 font-semibold font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> กำลังเรียน
                          </span>
                          <span className="text-slate-400 font-mono font-semibold">
                            {progress}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Details: Rating, Hours, Students & Action */}
                  <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-1 text-amber-400 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{course.rating.toFixed(2)}</span>
                        <span className="text-slate-500 text-[10px]">
                          ({course.reviewsCount})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.estimatedHours} ชม.</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{course.enrolledStudents.toLocaleString()}</span>
                      </div>
                    </div>

                    <Link
                      href={`/courses/${course.slug}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 transition-all shadow-md shadow-cyan-500/10 group-hover:shadow-cyan-500/20"
                    >
                      <span>{enrolled ? "เรียนต่อทันที" : "ดูรายละเอียดและเริ่มเรียน"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-base font-semibold text-slate-300">
              ไม่พบหลักสูตรที่ตรงกับเงื่อนไขการค้นหา
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedDifficulty("all");
                setSearchFilter("");
              }}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
