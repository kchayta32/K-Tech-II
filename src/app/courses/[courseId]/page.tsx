"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Award, 
  CheckCircle2, 
  PlayCircle, 
  Code2, 
  HelpCircle, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Terminal
} from "lucide-react";
import { getCourseById, getCourseBySlug, allCourses } from "@/data";
import { useProgress } from "@/lib/progress-context";
import { formatTime } from "@/lib/utils";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const course = getCourseById(courseId) || getCourseBySlug(courseId);

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    "m1": true,
    "m2": true,
  });

  const { isBookmarked, toggleBookmark, isEnrolled, enrollInCourse, getCourseProgress, isLessonCompleted } = useProgress();

  if (!course) {
    notFound();
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalQuizCount = course.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.quiz && l.quiz.length > 0).length, 0);
  const totalExerciseCount = course.modules.reduce((acc, m) => acc + m.lessons.filter(l => l.exercise).length, 0);
  const progress = getCourseProgress(course.id, totalLessons);
  const enrolled = isEnrolled(course.id);
  const bookmarked = isBookmarked(course.id);
  const firstLessonId = course.modules[0]?.lessons[0]?.id || "l1";

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "interactive_code": return <Code2 className="w-4 h-4 text-cyan-400" />;
      case "quiz": return <HelpCircle className="w-4 h-4 text-purple-400" />;
      case "video": return <PlayCircle className="w-4 h-4 text-emerald-400" />;
      default: return <FileText className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-8">
          <Link href="/" className="hover:text-teal-400">หน้าแรก</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-teal-400">หลักสูตร</Link>
          <span>/</span>
          <span className="text-slate-200 font-medium">{course.title}</span>
        </div>

        {/* Course Hero Banner */}
        <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="text-3xl p-2 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  {course.badgeIcon}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-semibold uppercase tracking-wider">
                  {course.categoryId}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700/60">
                  ระดับ: {course.difficulty}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 py-4 px-6 bg-slate-950/60 rounded-2xl border border-slate-800 text-sm text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{course.rating}</span>
                  <span className="text-xs text-slate-400">({course.reviewsCount} รีวิว)</span>
                </div>
                <div className="w-px h-4 bg-slate-800" />
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>{course.enrolledStudents.toLocaleString()} ผู้เรียน</span>
                </div>
                <div className="w-px h-4 bg-slate-800" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>{course.estimatedHours} ชั่วโมงโดยประมาณ</span>
                </div>
                <div className="w-px h-4 bg-slate-800" />
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>มีใบประกาศนียบัตร</span>
                </div>
              </div>

              {/* Instructor snippet */}
              <div className="flex items-center gap-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-10 h-10 rounded-full border border-teal-500/40 object-cover"
                />
                <div>
                  <div className="text-xs text-slate-400">ผู้สอนหลักสูตร</div>
                  <div className="text-sm font-bold text-white">{course.instructor.name} · <span className="text-teal-400 font-normal">{course.instructor.role}</span></div>
                </div>
              </div>
            </div>

            {/* Quick Action Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">สถานะการเรียนรู้</div>
                <div className="text-2xl font-extrabold text-white mb-4">
                  {enrolled ? "กำลังเรียนรู้หลักสูตรนี้" : "เปิดให้เรียนฟรี 100%"}
                </div>

                {enrolled && (
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>ความคืบหน้ารวม</span>
                      <span className="font-bold text-teal-400">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2.5 mb-6 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>{totalLessons} บทเรียนพร้อม Interactive Editor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>{totalExerciseCount} แบบฝึกหัด Coding พร้อมตรวจผลอัตโนมัติ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>{totalQuizCount} ชุดแบบทดสอบวัดผลความรู้ (Quiz)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>รับใบประกาศนียบัตรเมื่อทำคะแนนผ่านเกณฑ์</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/courses/${course.slug}/learn/${firstLessonId}`}
                  onClick={() => enrollInCourse(course.id)}
                  className="w-full py-3.5 px-6 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl text-center transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
                >
                  <span>{enrolled ? "เรียนต่อจากบทเรียนเดิม" : "เริ่มต้นเรียนหลักสูตรนี้"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => toggleBookmark(course.id)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors border border-slate-800 flex items-center justify-center gap-2"
                >
                  {bookmarked ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-teal-400 fill-teal-400/20" />
                      <span>บันทึกแล้ว (Bookmarked)</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>บันทึกไว้อ่านภายหลัง</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout: Syllabus & Extra Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Learning Outcomes & Modules Accordion */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Outcomes */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span>สิ่งที่คุณจะได้รับจากหลักสูตรนี้</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum & Syllabus */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                    <span>สารบัญหลักสูตร (Syllabus)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {course.modules.length} โมดูลการเรียนรู้ · {totalLessons} บทเรียนทั้งหมด
                  </p>
                </div>
              </div>

              {/* Modules Accordion */}
              <div className="space-y-4">
                {course.modules.map((module, modIdx) => {
                  const isExpanded = !!expandedModules[module.id];
                  const moduleLessonsCompleted = module.lessons.filter(l => isLessonCompleted(course.id, l.id)).length;

                  return (
                    <div
                      key={module.id}
                      className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40 transition-all"
                    >
                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold flex items-center justify-center">
                            {modIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-white">
                              {module.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400 hidden sm:inline">
                            {moduleLessonsCompleted}/{module.lessons.length} บท
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Lessons List */}
                      {isExpanded && (
                        <div className="divide-y divide-slate-800/60 border-t border-slate-800/80 bg-slate-900/20">
                          {module.lessons.map((lesson, lessonIdx) => {
                            const completed = isLessonCompleted(course.id, lesson.id);

                            return (
                              <Link
                                key={lesson.id}
                                href={`/courses/${course.slug}/learn/${lesson.id}`}
                                className="flex items-center justify-between p-3.5 sm:p-4 pl-6 sm:pl-8 hover:bg-slate-800/40 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
                                    {getLessonIcon(lesson.type)}
                                  </div>
                                  <div>
                                    <div className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-teal-300 transition-colors flex items-center gap-2">
                                      <span>{lesson.title}</span>
                                      {lesson.exercise && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                          Interactive Code
                                        </span>
                                      )}
                                      {lesson.quiz && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                          Quiz
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                      {formatTime(lesson.durationMinutes)} · {lesson.description}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {completed ? (
                                    <span className="flex items-center gap-1 text-[11px] text-teal-400 font-medium">
                                      <CheckCircle2 className="w-4 h-4 fill-teal-400/20" />
                                      <span className="hidden sm:inline">ผ่านแล้ว</span>
                                    </span>
                                  ) : (
                                    <span className="text-xs text-slate-500 group-hover:text-teal-400 transition-colors">
                                      เริ่มเรียน
                                    </span>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Column: Prerequisites, Instructor, Tags */}
          <div className="space-y-8">
            {/* Prerequisites */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>ความรู้พื้นฐานที่ควรมี (Prerequisites)</span>
              </h3>
              <ul className="space-y-2.5">
                {course.prerequisites.map((prereq, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-teal-400 font-bold">•</span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructor Profile */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                เกี่ยวกับผู้สอน
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full border-2 border-teal-500/50 object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{course.instructor.name}</h4>
                  <p className="text-xs text-teal-400">{course.instructor.role}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {course.instructor.bio}
              </p>
            </div>

            {/* Tags */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                หัวข้อและทักษะที่เกี่ยวข้อง
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
