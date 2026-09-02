"use client";

import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Layers,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { Lesson } from "@/types";
import { cn } from "@/lib/utils";
import {
  D3ChartVisualizer,
  KafkaStreamVisualizer,
  K8sClusterVisualizer,
  NeuralNetVisualizer,
} from "@/components/visualizers";

interface MarkdownViewerProps {
  lesson: Lesson;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  isCompleted?: boolean;
  onMarkCompleted?: () => void;
}

export function MarkdownViewer({
  lesson,
  onNextLesson,
  onPrevLesson,
  hasNext = false,
  hasPrev = false,
  isCompleted = false,
  onMarkCompleted,
}: MarkdownViewerProps) {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [activeVisualizerTab, setActiveVisualizerTab] = useState<
    "content" | "visualizer"
  >(lesson.visualizerType ? "visualizer" : "content");

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId(null);
    }, 2000);
  };

  // Helper to render embedded visualizer if available
  const renderVisualizer = (type?: Lesson["visualizerType"]) => {
    switch (type) {
      case "d3-chart":
        return <D3ChartVisualizer />;
      case "kafka-stream":
        return <KafkaStreamVisualizer />;
      case "k8s-cluster":
        return <K8sClusterVisualizer />;
      case "neural-net":
        return <NeuralNetVisualizer />;
      default:
        return null;
    }
  };

  // Custom parser to format markdown blocks cleanly with callouts & code blocks
  const renderFormattedMarkdown = (content: string) => {
    if (!content) return null;

    const sections = content.split("\n\n");

    return sections.map((section, sIdx) => {
      const trimmed = section.trim();

      // Heading 1 (#)
      if (trimmed.startsWith("# ")) {
        return (
          <h1
            key={sIdx}
            className="text-2xl lg:text-3xl font-bold text-slate-100 mt-6 mb-4 pb-2 border-b border-slate-800 flex items-center gap-2"
          >
            <span className="w-2 h-7 bg-cyan-400 rounded-full inline-block shrink-0" />
            <span className="gradient-text">{trimmed.replace(/^#\s+/, "")}</span>
          </h1>
        );
      }

      // Heading 2 (##)
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={sIdx}
            className="text-xl lg:text-2xl font-bold text-slate-100 mt-6 mb-3 flex items-center gap-2"
          >
            <span className="text-cyan-400 font-mono">#</span>
            <span>{trimmed.replace(/^##\s+/, "")}</span>
          </h2>
        );
      }

      // Heading 3 (###)
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={sIdx}
            className="text-base lg:text-lg font-semibold text-teal-300 mt-4 mb-2"
          >
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      }

      // Callout: TIP (> [!TIP] or > 💡)
      if (
        trimmed.startsWith("> [!TIP]") ||
        trimmed.startsWith("> 💡") ||
        trimmed.toLowerCase().includes("tip:")
      ) {
        const text = trimmed
          .replace(/^>\s*\[!TIP\]\s*/i, "")
          .replace(/^>\s*💡\s*/, "")
          .replace(/^>\s*/, "");
        return (
          <div
            key={sIdx}
            className="my-4 p-4 rounded-xl bg-teal-950/40 border border-teal-500/40 text-teal-200 text-sm leading-relaxed shadow-lg shadow-teal-950/20 relative overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-teal-300 block mb-1">
                  💡 คำแนะนำ / Pro Tip
                </span>
                <p className="text-teal-100/90">{text}</p>
              </div>
            </div>
          </div>
        );
      }

      // Callout: WARNING (> [!WARNING] or > ⚠️)
      if (
        trimmed.startsWith("> [!WARNING]") ||
        trimmed.startsWith("> ⚠️") ||
        trimmed.toLowerCase().includes("warning:")
      ) {
        const text = trimmed
          .replace(/^>\s*\[!WARNING\]\s*/i, "")
          .replace(/^>\s*⚠️\s*/, "")
          .replace(/^>\s*/, "");
        return (
          <div
            key={sIdx}
            className="my-4 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-sm leading-relaxed shadow-lg shadow-amber-950/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-amber-300 block mb-1">
                  ⚠️ ข้อควรระวัง / Warning
                </span>
                <p className="text-amber-100/90">{text}</p>
              </div>
            </div>
          </div>
        );
      }

      // Callout: NOTE (> [!NOTE] or > 📌)
      if (
        trimmed.startsWith("> [!NOTE]") ||
        trimmed.startsWith("> 📌") ||
        trimmed.toLowerCase().includes("note:")
      ) {
        const text = trimmed
          .replace(/^>\s*\[!NOTE\]\s*/i, "")
          .replace(/^>\s*📌\s*/, "")
          .replace(/^>\s*/, "");
        return (
          <div
            key={sIdx}
            className="my-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-sm leading-relaxed shadow-lg shadow-cyan-950/20"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-cyan-300 block mb-1">
                  📌 บันทึกสำคัญ / Key Note
                </span>
                <p className="text-cyan-100/90">{text}</p>
              </div>
            </div>
          </div>
        );
      }

      // Code Block (```lang ... ```)
      if (trimmed.startsWith("```")) {
        const lines = trimmed.split("\n");
        const firstLine = lines[0];
        const lang = firstLine.replace("```", "").trim() || "typescript";
        const codeLines = lines.slice(1, -1).join("\n");
        const codeId = `code-block-${sIdx}`;
        const isCopied = copiedCodeId === codeId;

        return (
          <div
            key={sIdx}
            className="my-5 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl"
          >
            {/* Code Block Top Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px] text-cyan-300 font-semibold uppercase tracking-wider">
                  {lang}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(codeLines, codeId)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-slate-300 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">คัดลอกแล้ว</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>คัดลอกโค้ด</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Lines with line numbers */}
            <pre className="p-4 overflow-x-auto text-xs lg:text-[13px] font-mono leading-relaxed text-slate-200 custom-scrollbar">
              <code>{codeLines}</code>
            </pre>
          </div>
        );
      }

      // Unordered list items (- or *)
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const listItems = trimmed.split("\n");
        return (
          <ul key={sIdx} className="my-3 space-y-2 text-sm text-slate-300 pl-2">
            {listItems.map((item, lIdx) => (
              <li key={lIdx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                <span className="leading-relaxed">
                  {item.replace(/^[-*]\s+/, "")}
                </span>
              </li>
            ))}
          </ul>
        );
      }

      // Numbered list items (1. 2. 3.)
      if (/^\d+\.\s+/.test(trimmed)) {
        const listItems = trimmed.split("\n");
        return (
          <ol key={sIdx} className="my-3 space-y-2 text-sm text-slate-300 pl-2">
            {listItems.map((item, lIdx) => (
              <li key={lIdx} className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-bold text-cyan-400 shrink-0 mt-0.5">
                  {lIdx + 1}.
                </span>
                <span className="leading-relaxed">
                  {item.replace(/^\d+\.\s+/, "")}
                </span>
              </li>
            ))}
          </ol>
        );
      }

      // Regular Paragraph with inline formatting
      return (
        <p
          key={sIdx}
          className="text-sm lg:text-base text-slate-300 leading-relaxed my-3"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar bg-slate-950/60 p-4 lg:p-8">
      {/* Top Breadcrumb & Visualizer Tab Switcher (if lesson has visualizer) */}
      <div className="max-w-4xl mx-auto w-full mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-1">
            {lesson.type.toUpperCase().replace("_", " ")}
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100">
            {lesson.title}
          </h1>
          {lesson.titleEn && (
            <p className="text-xs text-slate-400 mt-0.5">{lesson.titleEn}</p>
          )}
        </div>

        {lesson.visualizerType && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveVisualizerTab("content")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeVisualizerTab === "content"
                  ? "bg-slate-800 text-slate-100 shadow"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>เนื้อหาบทเรียน</span>
            </button>
            <button
              onClick={() => setActiveVisualizerTab("visualizer")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeVisualizerTab === "visualizer"
                  ? "bg-gradient-to-r from-cyan-500/30 to-teal-500/30 text-cyan-300 border border-cyan-500/40 shadow-lg"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Visualizer Sandbox</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto w-full flex-1">
        {/* If Visualizer tab is active */}
        {lesson.visualizerType && activeVisualizerTab === "visualizer" ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3 text-xs text-cyan-200">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p>
                <strong>Interactive Sandbox Mode:</strong> คุณสามารถปรับแต่งค่า
                ทดลองส่งสัญญาณ และสังเกตผลการทำงานเชิงสถาปัตยกรรมได้แบบ Real-time
              </p>
            </div>

            {renderVisualizer(lesson.visualizerType)}

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-slate-200 mb-2">
                คำอธิบายทฤษฎีประกอบ
              </h3>
              <div className="prose-dark">
                {renderFormattedMarkdown(lesson.contentMarkdown)}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* If lesson has an attached visualizer, show a banner trigger */}
            {lesson.visualizerType && (
              <div
                onClick={() => setActiveVisualizerTab("visualizer")}
                className="cursor-pointer group p-3.5 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-slate-900/60 hover:border-cyan-500/60 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-200 group-hover:text-cyan-100">
                      มี Visualizer Sandbox สำหรับบทเรียนนี้!
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      คลิกเพื่อเปิดแบบจำลองสถาปัตยกรรมแบบโต้ตอบได้
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium">
                  <span>เปิด Visualizer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            {/* Markdown rendered body */}
            <div className="prose-dark">{renderFormattedMarkdown(lesson.contentMarkdown)}</div>
          </div>
        )}
      </div>

      {/* Navigation & Mark Completed Bottom Bar */}
      <div className="max-w-4xl mx-auto w-full mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Previous Lesson Button */}
        {hasPrev ? (
          <button
            type="button"
            onClick={onPrevLesson}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors shadow"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>บทก่อนหน้า</span>
          </button>
        ) : (
          <div />
        )}

        {/* Mark Completed / Done Button */}
        <div className="flex items-center gap-3">
          {onMarkCompleted && (
            <button
              type="button"
              onClick={onMarkCompleted}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg",
                isCompleted
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-600/50 shadow-emerald-950/50"
                  : "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:opacity-95 shadow-cyan-500/20 hover:scale-[1.02]"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? "เรียนจบแล้ว (+50 XP)" : "ทำเครื่องหมายว่าเรียนแล้ว (+50 XP)"}</span>
            </button>
          )}

          {/* Next Lesson Button */}
          {hasNext && (
            <button
              type="button"
              onClick={onNextLesson}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs font-medium text-cyan-200 hover:bg-cyan-900/60 transition-colors shadow"
            >
              <span>บทถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
