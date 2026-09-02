"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Save,
  Download,
  Trash2,
  Check,
  Eye,
  Edit3,
  X,
  Bold,
  Italic,
  Code,
  List,
  Heading,
  Sparkles,
} from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { cn } from "@/lib/utils";

interface NotesDrawerProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function NotesDrawer({
  courseId,
  lessonId,
  lessonTitle,
  isOpen,
  onClose,
}: NotesDrawerProps) {
  const { getLessonNote, saveLessonNote } = useProgress();
  const [note, setNote] = useState<string>("");
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load existing note on lesson change
  useEffect(() => {
    const saved = getLessonNote(courseId, lessonId);
    setNote(saved || "");
    setIsSaved(true);
  }, [courseId, lessonId, getLessonNote]);

  // Debounced auto-save (800ms)
  useEffect(() => {
    if (!isOpen) return;

    setIsSaved(false);
    const timer = setTimeout(() => {
      saveLessonNote(courseId, lessonId, note);
      setIsSaved(true);
      setLastSavedTime(new Date().toLocaleTimeString("th-TH"));
    }, 800);

    return () => clearTimeout(timer);
  }, [note, courseId, lessonId, isOpen, saveLessonNote]);

  const insertFormatting = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = note.substring(start, end);
    const replacement = `${prefix}${selectedText || "ข้อความ"}${suffix}`;

    const newNote =
      note.substring(0, start) + replacement + note.substring(end);
    setNote(newNote);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 6)
      );
    }, 50);
  };

  const handleDownload = () => {
    const blob = new Blob(
      [`# บันทึกบทเรียน: ${lessonTitle}\n\n${note}\n\n---\nบันทึกจาก K-Tech MOOC Learning Platform`],
      { type: "text/markdown;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ktech-note-${lessonId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm("คุณต้องการลบบันทึกในบทเรียนนี้ทั้งหมดใช่หรือไม่?")) {
      setNote("");
      saveLessonNote(courseId, lessonId, "");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 lg:w-[420px] bg-slate-950/95 border-l border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              สมุดโน้ตส่วนตัว (Lesson Notes)
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
              {lessonTitle}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-3 py-2 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between gap-1 text-xs">
        {/* Formatting Buttons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={() => insertFormatting("**", "**")}
            title="ตัวหนา (Bold)"
            className="p-1.5 rounded hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting("*", "*")}
            title="ตัวเอียง (Italic)"
            className="p-1.5 rounded hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting("### ")}
            title="หัวข้อ (Heading)"
            className="p-1.5 rounded hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <Heading className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting("`", "`")}
            title="โค้ดแบบอินไลน์ (Code)"
            className="p-1.5 rounded hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertFormatting("- ")}
            title="รายการแบบมีสัญลักษณ์ (Bullet list)"
            className="p-1.5 rounded hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setMode("edit")}
            className={cn(
              "px-2 py-1 rounded text-[11px] font-medium transition-colors",
              mode === "edit"
                ? "bg-slate-800 text-cyan-300"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Edit3 className="w-3 h-3 inline mr-1" />
            เขียน
          </button>
          <button
            onClick={() => setMode("preview")}
            className={cn(
              "px-2 py-1 rounded text-[11px] font-medium transition-colors",
              mode === "preview"
                ? "bg-slate-800 text-cyan-300"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Eye className="w-3 h-3 inline mr-1" />
            ดูพรีวิว
          </button>
        </div>
      </div>

      {/* Main Textarea / Preview Box */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {mode === "edit" ? (
          <textarea
            ref={textareaRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="จดบันทึกประเด็นสำคัญ เทคนิค หรือข้อความเตือนความจำที่นี่ (รองรับ Markdown)..."
            className="w-full h-full bg-transparent text-xs lg:text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed"
          />
        ) : (
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed whitespace-pre-wrap font-sans">
            {note.trim() ? (
              note
            ) : (
              <span className="text-slate-600 italic">ยังไม่มีข้อความบันทึก</span>
            )}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>บันทึกอัตโนมัติแล้ว {lastSavedTime}</span>
            </>
          ) : (
            <span className="text-cyan-400 animate-pulse">กำลังบันทึก...</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            title="ลบโน้ตทั้งหมด"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            title="ดาวน์โหลดเป็นไฟล์ .md"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 text-xs font-medium transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก .md</span>
          </button>
        </div>
      </div>
    </div>
  );
}
