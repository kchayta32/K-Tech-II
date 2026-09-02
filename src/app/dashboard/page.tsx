"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Flame, 
  Award, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Bookmark, 
  TrendingUp, 
  ShieldCheck, 
  LogIn, 
  LogOut,
  Download,
  Share2,
  ExternalLink,
  Code2,
  Calendar,
  Zap
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useProgress } from "@/lib/progress-context";
import { allCourses, getCourseById } from "@/data";
import { calculateLevel, formatTime } from "@/lib/utils";

export default function DashboardPage() {
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const { getCourseProgress, certificates, triggerConfetti } = useProgress();

  const [activeTab, setActiveTab] = useState<"courses" | "certificates" | "badges">("courses");

  const xp = profile?.xp || 0;
  const { level, currentXp, nextLevelXp, progress: levelProgress } = calculateLevel(xp);
  const streak = profile?.streakDays || 1;

  const enrolledCourseObjects = (profile?.enrolledCourses || [])
    .map((id) => getCourseById(id))
    .filter(Boolean);

  const bookmarkedCourseObjects = (profile?.bookmarks || [])
    .map((id) => getCourseById(id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header Banner */}
        <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            {/* User Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={profile?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                  alt={profile?.displayName || "User"}
                  className="w-20 h-20 rounded-2xl border-2 border-teal-500/60 object-cover shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-teal-500 text-slate-950 font-bold text-xs shadow-md">
                  Lv.{level}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {profile?.displayName || "K-Tech Learner"}
                  </h1>
                  {profile?.isGuest && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      Guest Account
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-mono mb-2">
                  {profile?.email || "learner@k-tech.io"}
                </p>

                {/* Level XP Bar */}
                <div className="w-48 sm:w-64">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                    <span>XP: {currentXp}/{nextLevelXp}</span>
                    <span className="text-teal-400 font-bold">{levelProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Gamification Stats */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Streak */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span className="text-base font-extrabold font-mono">{streak}</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">วันต่อเนื่อง</span>
              </div>

              {/* Total XP */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-teal-400 mb-1">
                  <Zap className="w-4 h-4 fill-teal-400" />
                  <span className="text-base font-extrabold font-mono">{xp}</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total XP</span>
              </div>

              {/* Certificates */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-center min-w-[90px]">
                <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-base font-extrabold font-mono">{certificates.length}</span>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">ใบเซอร์ฯ</span>
              </div>

              {/* Auth actions */}
              <div className="ml-2">
                {profile?.isGuest ? (
                  <button
                    onClick={signInWithGoogle}
                    className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>เข้าสู่ระบบด้วย Google</span>
                  </button>
                ) : (
                  <button
                    onClick={signOut}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "courses"
                ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>คอร์สที่กำลังเรียน ({enrolledCourseObjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "certificates"
                ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>ใบประกาศนียบัตรที่ได้รับ ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("badges")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "badges"
                ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>เหรียญรางวัล ({profile?.badges?.length || 2})</span>
          </button>
        </div>

        {/* Tab 1: Enrolled Courses */}
        {activeTab === "courses" && (
          <div className="space-y-8">
            {enrolledCourseObjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourseObjects.map((course) => {
                  if (!course) return null;
                  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
                  const progress = getCourseProgress(course.id, totalLessons);
                  const firstLessonId = course.modules[0]?.lessons[0]?.id || "l1";

                  return (
                    <div
                      key={course.id}
                      className="bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                            {course.badgeIcon}
                          </span>
                          <span className="text-xs font-semibold text-teal-400 font-mono">
                            {progress}% เสร็จสิ้น
                          </span>
                        </div>

                        <Link href={`/courses/${course.slug || course.id}`}>
                          <h3 className="text-base font-bold text-white hover:text-teal-300 transition-colors mb-2 line-clamp-1">
                            {course.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                          {course.tagline}
                        </p>
                      </div>

                      <div>
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          href={`/courses/${course.slug || course.id}/learn/${firstLessonId}`}
                          className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl text-center transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/10"
                        >
                          <span>{progress === 100 ? "ทบทวนบทเรียน" : "เรียนต่อทันที"}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">ยังไม่มีคอร์สที่ลงทะเบียน</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
                  เลือกคอร์สที่คุณสนใจจากคลังหลักสูตร แล้วเริ่มเรียนรู้ได้ฟรีทันที
                </p>
                <Link
                  href="/courses"
                  className="px-6 py-2.5 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-teal-400 transition-colors inline-block"
                >
                  สำรวจหลักสูตรทั้งหมด
                </Link>
              </div>
            )}

            {/* Bookmarks section */}
            {bookmarkedCourseObjects.length > 0 && (
              <div className="pt-8 border-t border-slate-800">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-teal-400" />
                  <span>คอร์สที่บันทึกไว้ (Bookmarks)</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedCourseObjects.map((course) => {
                    if (!course) return null;
                    return (
                      <Link
                        key={course.id}
                        href={`/courses/${course.slug || course.id}`}
                        className="p-4 bg-slate-900/40 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                            {course.badgeIcon}
                          </span>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                              {course.title}
                            </h4>
                            <span className="text-[10px] text-slate-400">{course.estimatedHours} ชั่วโมง · {course.difficulty}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Certificates */}
        {activeTab === "certificates" && (
          <div>
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-6 bg-slate-900/80 border border-amber-500/30 rounded-2xl relative overflow-hidden shadow-xl"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {cert.verificationCode}
                        </span>
                        <h3 className="text-base font-bold text-white mt-2">
                          {cert.courseTitle}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          มอบให้: <span className="text-teal-300 font-semibold">{cert.studentName}</span>
                        </p>
                      </div>
                      <Award className="w-8 h-8 text-amber-400 shrink-0" />
                    </div>

                    <div className="text-[11px] text-slate-400 mb-6 flex items-center justify-between border-t border-slate-800 pt-3">
                      <span>ออกให้เมื่อ: {cert.issueDate}</span>
                      <span className="text-emerald-400 font-semibold">{cert.grade}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/certificates/${cert.verificationCode}`}
                        className="flex-1 py-2 px-3 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>เปิดหน้าใบประกาศนียบัตร</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">ยังไม่มีใบประกาศนียบัตร</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
                  เรียนจบคอร์สใดก็ได้ให้ครบ 100% พร้อมทำแบบทดสอบผ่านเกณฑ์ 80% เพื่อรับใบประกาศนียบัตรดิจิทัลพร้อมรหัสตรวจสอบสากล
                </p>
                <Link
                  href="/courses"
                  className="px-6 py-2.5 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-teal-400 transition-colors inline-block"
                >
                  เข้าสู่บทเรียน
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Badges */}
        {activeTab === "badges" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(profile?.badges || [
              {
                id: "first-step",
                name: "ก้าวแรกสู่นักพัฒนา",
                icon: "🚀",
                description: "เริ่มต้นเรียนรู้บทเรียนแรกบน K-Tech",
                unlockedAt: new Date().toISOString(),
              },
              {
                id: "streak-3",
                name: "ต่อเนื่อง 3 วัน",
                icon: "🔥",
                description: "เข้าเรียนติดต่อกันอย่างน้อย 3 วัน",
                unlockedAt: new Date().toISOString(),
              }
            ]).map((badge) => (
              <div
                key={badge.id}
                className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl text-center flex flex-col items-center justify-center"
              >
                <span className="text-4xl p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 mb-3">
                  {badge.icon}
                </span>
                <h4 className="text-sm font-bold text-white mb-1">{badge.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {badge.description}
                </p>
                <span className="text-[10px] text-teal-400 font-mono">
                  ปลดล็อกแล้ว ✓
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
