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
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
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

  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
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

  // Keyboard shortcut listener for Escape to close burger menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && burgerMenuOpen) {
        setBurgerMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [burgerMenuOpen]);

  // Lock body scroll when burger menu is open
  useEffect(() => {
    if (burgerMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [burgerMenuOpen]);

  // Close burger menu on route change
  useEffect(() => {
    setBurgerMenuOpen(false);
    setCategoriesOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const triggerSearch = () => {
    setBurgerMenuOpen(false);
    window.dispatchEvent(new CustomEvent("open-ktech-search"));
  };

  const levelInfo = calculateLevel(profile?.xp || 0);

  const mainNavLinks = [
    { label: "หลักสูตร", href: "/courses", icon: BookOpen },
    { label: "Roadmaps", href: "/roadmaps", icon: Compass },
    { label: "Playground", href: "/playground", icon: Terminal },
    { label: "GPA Calculator", href: "/tools/gpa-calculator", icon: Calculator },
    { label: "แดชบอร์ด", href: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <>
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
              <nav className="hidden xl:flex items-center gap-1">
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

                {mainNavLinks.map((link) => {
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
                <div className="relative hidden sm:block" ref={profileRef}>
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

                    {/* XP & Streak */}
                    <div className="flex flex-col items-start text-left">
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
                  className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 rounded-xl transition-all shadow-md shadow-cyan-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>เข้าสู่ระบบ</span>
                </button>
              )}

              {/* Master Burger Menu Button (Slide-Down Trigger) */}
              <button
                type="button"
                onClick={() => setBurgerMenuOpen(!burgerMenuOpen)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-semibold text-xs border ${
                  burgerMenuOpen
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                    : "bg-slate-900/90 text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-800/90"
                }`}
                aria-label="เปิดเมนูหลักแบบเลื่อนลง (Burger Menu)"
                aria-expanded={burgerMenuOpen}
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <motion.span
                    animate={burgerMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                    className="absolute w-4 h-0.5 bg-current rounded-full transition-transform"
                  />
                  <motion.span
                    animate={burgerMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="absolute w-4 h-0.5 bg-current rounded-full transition-opacity"
                  />
                  <motion.span
                    animate={burgerMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                    className="absolute w-4 h-0.5 bg-current rounded-full transition-transform"
                  />
                </div>
                <span className="hidden sm:inline">เมนู</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* FULL TOP-SLIDING BURNER MENU OVERLAY (แบบเลื่อนลงจากด้านบนเมื่อเปิดเมนู) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {burgerMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setBurgerMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            />

            {/* Top Slide-Down Container */}
            <motion.div
              initial={{ y: "-100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 left-0 right-0 z-50 max-h-[95vh] overflow-y-auto bg-slate-950/98 border-b-2 border-cyan-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.95)] backdrop-blur-2xl text-slate-100 ring-1 ring-white/10"
            >
              {/* Inner Container */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header inside Top-sliding Drawer */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-teal-500/30">
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <span className="font-mono font-black text-xl bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
                          K
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                        <span>K-Tech Academy Navigation</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                          HUB
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400">
                        ศูนย์กลางหลักสูตร เครื่องมือทดลอง และแดชบอร์ดความคืบหน้า
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[11px] font-mono text-slate-400 bg-slate-900 rounded-lg border border-slate-800">
                      ESC ปิดเมนู
                    </kbd>
                    <button
                      type="button"
                      onClick={() => setBurgerMenuOpen(false)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                      title="ปิดเมนู"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Quick Search Banner */}
                <div className="my-6">
                  <button
                    type="button"
                    onClick={triggerSearch}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all text-left group shadow-inner"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
                        <Search className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors block">
                          ค้นหาหลักสูตร, เทคโนโลยี และแบบฝึกหัด...
                        </span>
                        <span className="text-xs text-slate-400">
                          เช่น Svelte 5, TypeScript Generics, Kafka, Docker, PyTorch, GPA
                        </span>
                      </div>
                    </div>

                    <kbd className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-cyan-400 bg-slate-950 rounded-lg border border-slate-800">
                      <span>⌘K</span> หรือ <span>Ctrl+K</span>
                    </kbd>
                  </button>
                </div>

                {/* Main 3-Column Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {/* Column 1: Core Tracks / Categories */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 px-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>5 สาขาวิชาหลัก (Core Disciplines)</span>
                    </div>

                    <div className="space-y-2">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/courses?category=${cat.id}`}
                          onClick={() => setBurgerMenuOpen(false)}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all group"
                        >
                          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-cyan-500/30 group-hover:scale-105 transition-all shrink-0">
                            {iconMap[cat.icon] || <Zap className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                                {cat.nameEn}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
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
                  </div>

                  {/* Column 2: Interactive Tools & Career Roadmaps */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-400 px-1">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>เครื่องมือ & แผนผังการเรียน</span>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href="/roadmaps"
                        onClick={() => setBurgerMenuOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-900 transition-all group"
                      >
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform shrink-0">
                          <Compass className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-200 group-hover:text-purple-300 transition-colors block">
                            Career Learning Roadmaps
                          </span>
                          <span className="text-xs text-slate-400">
                            แผนผังการเรียนรู้ทีละสเต็ปสู่ Fullstack, AI, DevOps Lead
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/tools/gpa-calculator"
                        onClick={() => setBurgerMenuOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-900 transition-all group"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors block">
                            เครื่องคำนวณ GPA & เกียรตินิยม
                          </span>
                          <span className="text-xs text-slate-400">
                            จำลองและคำนวณเกรดเฉลี่ยสะสม พร้อมเช็คสถานะทางวิชาการ
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/playground"
                        onClick={() => setBurgerMenuOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-900 transition-all group"
                      >
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors block">
                            Monaco Code Playground
                          </span>
                          <span className="text-xs text-slate-400">
                            ทดลองเขียนและรัน TypeScript, Svelte 5, D3.js และ Kafka ในเบราว์เซอร์
                          </span>
                        </div>
                      </Link>

                      <Link
                        href="/courses"
                        onClick={() => setBurgerMenuOpen(false)}
                        className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-900 transition-all group"
                      >
                        <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-105 transition-transform shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-slate-200 group-hover:text-teal-300 transition-colors block">
                            คลังหลักสูตรทั้งหมด (19+ Courses)
                          </span>
                          <span className="text-xs text-slate-400">
                            บทเรียนพร้อมแบบฝึกหัดโต้ตอบและการประเมินผลอัตโนมัติ
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: Learner Account & Quick Access */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 px-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>สถานะผู้เรียน & โปรไฟล์</span>
                    </div>

                    {profile ? (
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 space-y-4">
                        {/* Profile Card */}
                        <div className="flex items-center gap-3">
                          {profile.photoURL ? (
                            <img
                              src={profile.photoURL}
                              alt={profile.displayName || "User"}
                              className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-base text-white">
                              {profile.displayName?.charAt(0) || "U"}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white truncate">
                                {profile.displayName}
                              </h4>
                              {profile.isGuest && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                                  Guest
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 truncate font-mono">
                              {profile.email || "Guest Session"}
                            </p>
                          </div>
                        </div>

                        {/* XP Stats */}
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-teal-400 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-400 block">ระดับ {levelInfo.level}</span>
                              <span className="text-teal-300 font-bold">{profile.xp} XP</span>
                            </div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                            <div>
                              <span className="text-[10px] text-slate-400 block">Streak</span>
                              <span className="text-amber-300 font-bold">{profile.streakDays} วัน</span>
                            </div>
                          </div>
                        </div>

                        {/* Quick Dashboard Links */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                          <Link
                            href="/dashboard"
                            onClick={() => setBurgerMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                              <span>แดชบอร์ดการเรียนรู้</span>
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                          </Link>

                          <Link
                            href="/dashboard?tab=certificates"
                            onClick={() => setBurgerMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              <span>ใบประกาศนียบัตรของฉัน</span>
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                          </Link>

                          <Link
                            href="/dashboard?tab=bookmarks"
                            onClick={() => setBurgerMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                              <span>คอร์สที่บันทึกไว้ ({profile.bookmarks?.length || 0})</span>
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                          </Link>
                        </div>

                        {/* Sign in / Sign out button */}
                        <div className="pt-2 border-t border-slate-800/80">
                          {profile.isGuest ? (
                            <button
                              type="button"
                              onClick={() => {
                                setBurgerMenuOpen(false);
                                signInWithGoogle();
                              }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all hover:opacity-95"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>บันทึกความคืบหน้าด้วย Google</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setBurgerMenuOpen(false);
                                signOut();
                              }}
                              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 font-semibold text-xs border border-slate-700 transition-colors"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>ออกจากระบบ</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 text-center space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                          <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">เข้าสู่ระบบ K-Tech MOOC</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            บันทึกความคืบหน้า สะสม XP และรับใบประกาศนียบัตรฟรีตลอดชีพ
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setBurgerMenuOpen(false);
                            signInWithGoogle();
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>เข้าสู่ระบบด้วย Google</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Footer Info Strip */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      100% Free & Open Access
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Digital Verified Certificate
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <a
                      href="https://github.com/kchayta32/K-Tech-II"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

