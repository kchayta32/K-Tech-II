"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Compass,
  Terminal,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  Flame,
  Award,
  LogOut,
  User as UserIcon,
  Moon,
  Sun,
  Layout,
  Server,
  Database,
  Brain,
  Cloud,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useProgress } from "@/lib/progress-context";
import { calculateLevel } from "@/lib/utils";
import { CATEGORIES } from "@/data/categories";

const iconMap: Record<string, React.ReactNode> = {
  Layout: <Layout className="w-4 h-4 text-cyan-400" />,
  Server: <Server className="w-4 h-4 text-purple-400" />,
  Database: <Database className="w-4 h-4 text-emerald-400" />,
  Brain: <Brain className="w-4 h-4 text-pink-400" />,
  Cloud: <Cloud className="w-4 h-4 text-amber-400" />,
};

export default function Navbar() {
  const pathname = usePathname();
  const { profile, user, signInWithGoogle, signInAsGuest, signOut } = useAuth();
  const { isBookmarked } = useProgress();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const categoriesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Sync theme with html class
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      setTheme("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const triggerSearch = () => {
    window.dispatchEvent(new CustomEvent("open-ktech-search"));
  };

  const levelInfo = calculateLevel(profile?.xp || 0);

  const navLinks = [
    { label: "หลักสูตรทั้งหมด", href: "/courses", icon: BookOpen },
    { label: "แผนผังการเรียน (Roadmaps)", href: "/roadmaps", icon: Compass },
    { label: "Playground", href: "/playground", icon: Terminal },
    { label: "GPA Calculator", href: "/tools/gpa-calculator", icon: Terminal },
    { label: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090d16]/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-teal-500/20 group-hover:shadow-teal-400/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-mono font-black text-xl bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    K
                  </span>
                </div>
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                    K-Tech
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                    MOOC
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                  Next-Gen Tech Learning
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button
                  type="button"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                    categoriesOpen
                      ? "text-cyan-400 bg-slate-800/80"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  }`}
                  aria-expanded={categoriesOpen}
                >
                  <span>หมวดหมู่</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      categoriesOpen ? "rotate-180 text-cyan-400" : "text-slate-400"
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {categoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-2 w-80 rounded-2xl bg-slate-900/95 border border-slate-800 p-2 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 z-50"
                    >
                      <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          สาขาวิชาหลัก (Core Tracks)
                        </p>
                      </div>
                      <div className="space-y-1">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/courses?category=${cat.id}`}
                            onClick={() => setCategoriesOpen(false)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 transition-colors group"
                          >
                            <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 group-hover:border-cyan-500/40 transition-colors">
                              {iconMap[cat.icon] || <Zap className="w-4 h-4 text-cyan-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                                  {cat.nameEn}
                                </p>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                  {cat.courseCount} คอร์ส
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                {cat.name}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      isActive
                        ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={triggerSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-400 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-xl transition-all shadow-inner group"
              title="ค้นหาหลักสูตรและบทเรียน (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="hidden md:inline-block">ค้นหาเนื้อหา...</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-800 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
              aria-label="สลับธีม สว่าง/มืด"
              title={theme === "dark" ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* User Profile / XP Stats / Login */}
            {profile ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group"
                  aria-expanded={profileDropdownOpen}
                >
                  {/* Avatar / Level Indicator */}
                  <div className="relative">
                    {profile.photoURL ? (
                      <img
                        src={profile.photoURL}
                        alt={profile.displayName || "User"}
                        className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                        {profile.displayName?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-teal-500 text-[9px] font-black text-slate-950 rounded-full leading-tight font-mono">
                      L{levelInfo.level}
                    </span>
                  </div>

                  {/* XP & Streak (Desktop) */}
                  <div className="hidden sm:flex flex-col items-start text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">
                        {profile.displayName}
                      </span>
                      {profile.isGuest && (
                        <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                          Guest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-0.5 text-teal-400">
                        <Zap className="w-3 h-3 fill-teal-400" />
                        {profile.xp} XP
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Flame className="w-3 h-3 fill-amber-400" />
                        {profile.streakDays}d
                      </span>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-slate-900/95 border border-slate-800 p-3 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10 z-50"
                    >
                      {/* User Header */}
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-2">
                        <div className="flex items-center gap-3 mb-2.5">
                          {profile.photoURL ? (
                            <img
                              src={profile.photoURL}
                              alt={profile.displayName || "User"}
                              className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                              {profile.displayName?.charAt(0) || "U"}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate">
                              {profile.displayName}
                            </p>
                            <p className="text-xs text-slate-400 truncate font-mono">
                              {profile.email || "Guest Session"}
                            </p>
                          </div>
                        </div>

                        {/* Level Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-cyan-400 font-semibold font-mono">
                              Level {levelInfo.level}
                            </span>
                            <span className="text-slate-400 font-mono">
                              {levelInfo.currentXp} / {levelInfo.nextLevelXp} XP
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full transition-all duration-500"
                              style={{ width: `${levelInfo.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="space-y-1 text-xs font-medium">
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                          <span>แดชบอร์ดการเรียนรู้</span>
                        </Link>
                        <Link
                          href="/dashboard?tab=certificates"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                        >
                          <Award className="w-4 h-4 text-amber-400" />
                          <span>ใบประกาศนียบัตรของฉัน</span>
                        </Link>
                        <Link
                          href="/dashboard?tab=bookmarks"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-purple-400" />
                          <span>หลักสูตรที่บันทึกไว้ ({profile.bookmarks?.length || 0})</span>
                        </Link>
                      </div>

                      {/* Guest sign-in upgrade prompt or Sign-out */}
                      <div className="mt-2 pt-2 border-t border-slate-800/80">
                        {profile.isGuest ? (
                          <button
                            type="button"
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              signInWithGoogle();
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-900 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>บันทึกความคืบหน้าด้วย Google</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setProfileDropdownOpen(false);
                              signOut();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>ออกจากระบบ</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>เข้าสู่ระบบ</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
              aria-label="เปิดเมนูบนมือถือ"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4"
          >
            {/* Quick Search on Mobile */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                triggerSearch();
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-400 bg-slate-900 border border-slate-800 rounded-xl"
            >
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>ค้นหาหลักสูตรและแล็บ...</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            {/* Navigation Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 font-semibold"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Core Categories */}
            <div className="pt-3 border-t border-slate-800/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3 mb-2">
                หมวดหมู่หลักสูตร
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/courses?category=${cat.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-900 hover:text-cyan-300 transition-colors"
                  >
                    {iconMap[cat.icon] || <Zap className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{cat.nameEn}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-3 border-t border-slate-800/80">
              {profile?.isGuest ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signInWithGoogle();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>เข้าสู่ระบบด้วย Google</span>
                </button>
              ) : (
                <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-400">
                  <span>กำลังเรียนในฐานะ: <strong className="text-slate-200">{profile?.displayName}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="text-rose-400 hover:underline"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
