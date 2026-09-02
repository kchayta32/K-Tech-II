"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles,
  ArrowRight,
  Code2,
  Database,
  Cpu,
  Cloud,
  Layers,
  GraduationCap
} from "lucide-react";
import { allCourses, categories } from "@/data";
import { CategoryId, CourseDifficulty } from "@/types";
import { useProgress } from "@/lib/progress-context";
import { formatTime } from "@/lib/utils";

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CategoryId | null;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">(initialCategory || "all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<CourseDifficulty | "all">("all");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "duration">("popular");

  const { isBookmarked, toggleBookmark, isEnrolled, getCourseProgress } = useProgress();

  const filteredCourses = useMemo(() => {
    return allCourses
      .filter((course) => {
        // Category filter
        if (selectedCategory !== "all" && course.categoryId !== selectedCategory) {
          return false;
        }
        // Difficulty filter
        if (selectedDifficulty !== "all" && course.difficulty !== selectedDifficulty) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = course.title.toLowerCase().includes(query);
          const matchTitleEn = course.titleEn.toLowerCase().includes(query);
          const matchTagline = course.tagline.toLowerCase().includes(query);
          const matchDesc = course.description.toLowerCase().includes(query);
          const matchTags = course.tags.some(t => t.toLowerCase().includes(query));
          const matchInstructor = course.instructor.name.toLowerCase().includes(query);
          if (!matchTitle && !matchTitleEn && !matchTagline && !matchDesc && !matchTags && !matchInstructor) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "duration") return a.estimatedHours - b.estimatedHours;
        return b.enrolledStudents - a.enrolledStudents; // popular
      });
  }, [selectedCategory, selectedDifficulty, searchQuery, sortBy]);

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case "frontend": return <Code2 className="w-4 h-4 text-orange-400" />;
      case "backend": return <Layers className="w-4 h-4 text-rose-400" />;
      case "data": return <Database className="w-4 h-4 text-blue-400" />;
      case "ai-ml": return <Cpu className="w-4 h-4 text-emerald-400" />;
      case "devops": return <Cloud className="w-4 h-4 text-indigo-400" />;
      default: return <BookOpen className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>หลักสูตรวิศวกรรมเทคโนโลยีระดับสากล</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            สำรวจคอร์สเรียนทั้งหมดใน <span className="gradient-text">K-Tech</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            หลักสูตรเน้นการลงมือปฏิบัติจริง พร้อม Interactive Code Playground, ระบบจำลองการทำงาน, และการตรวจแบบฝึกหัดอัตโนมัติ
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อคอร์ส, เทคโนโลยี (e.g. Svelte, Kafka, Docker)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ล้าง
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Difficulty filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">ระดับ:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="all">ทุกระดับความยาก</option>
                  <option value="Beginner">ระดับเริ่มต้น (Beginner)</option>
                  <option value="Intermediate">ระดับกลาง (Intermediate)</option>
                  <option value="Advanced">ระดับสูง (Advanced)</option>
                </select>
              </div>

              {/* Sort by */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">เรียงตาม:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="popular">ผู้เรียนมากที่สุด</option>
                  <option value="rating">คะแนนรีวิวสูงสุด</option>
                  <option value="duration">ระยะเวลาสั้นไปยาว</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-5 border-t border-slate-800/80 no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategory === "all"
                  ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                  : "bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ทั้งหมด ({allCourses.length})</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.name} ({cat.courseCount})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
          <div>
            พบทั้งหมด <span className="font-semibold text-teal-400">{filteredCourses.length}</span> หลักสูตร
          </div>
          {(selectedCategory !== "all" || selectedDifficulty !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedDifficulty("all");
                setSearchQuery("");
              }}
              className="text-xs text-teal-400 hover:underline"
            >
              รีเซ็ตตัวกรองทั้งหมด
            </button>
          )}
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              const progress = getCourseProgress(course.id, totalLessons);
              const enrolled = isEnrolled(course.id);
              const bookmarked = isBookmarked(course.id);
              const firstLessonId = course.modules[0]?.lessons[0]?.id || "l1";

              return (
                <div
                  key={course.id}
                  className="group relative bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 hover:border-teal-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                          {course.badgeIcon}
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                            {getCategoryIcon(course.categoryId)}
                            {course.categoryId}
                          </div>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            course.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            course.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {course.difficulty}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleBookmark(course.id);
                        }}
                        className="p-2 rounded-xl bg-slate-800/40 text-slate-400 hover:text-teal-400 hover:bg-slate-800 transition-colors"
                        title={bookmarked ? "ลบบุ๊กมาร์ก" : "บันทึกคอร์ส"}
                      >
                        {bookmarked ? (
                          <BookmarkCheck className="w-5 h-5 text-teal-400 fill-teal-400/20" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Title & Tagline */}
                    <Link href={`/courses/${course.slug}`}>
                      <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors mb-2 line-clamp-1">
                        {course.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                      {course.tagline}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {course.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/40"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Course Metrics */}
                    <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-slate-950/60 rounded-xl border border-slate-800/60 text-[11px] text-slate-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-400" />
                        <span>{course.estimatedHours} ชม.</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{totalLessons} บทเรียน</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-200">{course.rating}</span>
                      </div>
                    </div>

                    {/* Progress Bar (if enrolled) */}
                    {enrolled && (
                      <div className="mb-4">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>ความคืบหน้า</span>
                          <span className="text-teal-400 font-semibold">{progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/courses/${course.slug}/learn/${firstLessonId}`}
                        className="flex-1 py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl text-center transition-all shadow-lg shadow-teal-500/10 flex items-center justify-center gap-1.5 group-hover:shadow-teal-500/20"
                      >
                        <span>{enrolled ? "เข้าสู่ห้องเรียน" : "เริ่มเรียนฟรี"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                      <Link
                        href={`/courses/${course.slug}`}
                        className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl text-center transition-colors"
                      >
                        ดูสารบัญ
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300 mb-1">ไม่พบหลักสูตรที่ตรงกับเงื่อนไข</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นๆ เพื่อค้นหาคอร์สที่คุณสนใจ
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedDifficulty("all");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 bg-teal-500 text-slate-950 font-semibold text-xs rounded-xl hover:bg-teal-400 transition-colors"
            >
              แสดงคอร์สทั้งหมด
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-teal-400">กำลังโหลดหลักสูตร K-Tech...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
