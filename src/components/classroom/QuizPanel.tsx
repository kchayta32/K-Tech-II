"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  Check,
  Code2,
} from "lucide-react";
import { QuizQuestion } from "@/types";
import { useProgress } from "@/lib/progress-context";
import { cn } from "@/lib/utils";

interface QuizPanelProps {
  quiz: QuizQuestion[];
  courseId: string;
  lessonId: string;
  onCompleted?: (score: number) => void;
}

export function QuizPanel({
  quiz,
  courseId,
  lessonId,
  onCompleted,
}: QuizPanelProps) {
  const { saveQuizScore, getQuizScore, completeLesson, triggerConfetti } =
    useProgress();

  const savedScore = getQuizScore(courseId, lessonId);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(savedScore !== undefined);
  const [currentScore, setCurrentScore] = useState<number>(savedScore || 0);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const percent = Math.round((correct / quiz.length) * 100);
    setCurrentScore(percent);
    setIsSubmitted(true);
    saveQuizScore(courseId, lessonId, percent);

    if (percent >= 80) {
      completeLesson(courseId, lessonId, 100);
      triggerConfetti();
    } else if (percent >= 50) {
      completeLesson(courseId, lessonId, 50);
    }

    if (onCompleted) onCompleted(percent);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const isAllAnswered = totalAnswered === quiz.length;
  const isDistinction = currentScore >= 80;
  const isPassed = currentScore >= 50;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar bg-slate-950 p-4 lg:p-8">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-slate-100">
                แบบทดสอบวัดความรู้ (Knowledge Check Quiz)
              </h2>
              <p className="text-xs text-slate-400">
                ตอบคำถาม {quiz.length} ข้อ • เกณฑ์ผ่าน 80% เพื่อรับเหรียญเกียรตินิยม
              </p>
            </div>
          </div>

          {/* Progress / Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              ตอบแล้ว {totalAnswered}/{quiz.length} ข้อ
            </span>
          </div>
        </div>

        {/* Results Summary Box if Submitted */}
        {isSubmitted && (
          <div
            className={cn(
              "p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl animate-in fade-in zoom-in-95 duration-200",
              isDistinction
                ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                : isPassed
                ? "bg-cyan-950/40 border-cyan-500/50 text-cyan-200"
                : "bg-rose-950/40 border-rose-500/50 text-rose-200"
            )}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-extrabold text-xl shadow-lg shrink-0",
                  isDistinction
                    ? "bg-emerald-500 text-slate-950"
                    : isPassed
                    ? "bg-cyan-500 text-slate-950"
                    : "bg-rose-500 text-white"
                )}
              >
                {currentScore}%
              </div>
              <div>
                <h3 className="text-sm lg:text-base font-bold text-slate-100 flex items-center gap-2">
                  {isDistinction
                    ? "🏆 ยอดเยี่ยมมาก! ผ่านเกณฑ์ระดับเกียรตินิยม"
                    : isPassed
                    ? "🏅 ผ่านการทดสอบ (Passed)"
                    : "🔄 ยังไม่ผ่านเกณฑ์ 80% ลองใหม่อีกครั้ง"}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  {isDistinction
                    ? "คุณได้รับ 100 XP และปลดล็อกสิทธิ์รับใบประกาศนียบัตร"
                    : isPassed
                    ? "คุณได้รับ 50 XP (สามารถทำใหม่เพื่อรับคะแนนเต็ม 100% ได้)"
                    : "ทบทวนบทเรียนอีกครั้งแล้วกดปุ่มทำใหม่ด้านล่าง"}
                </p>
              </div>
            </div>

            <button
              onClick={handleRetake}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ทำแบบทดสอบใหม่</span>
            </button>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {quiz.map((q, qIdx) => {
            const selectedOpt = selectedAnswers[qIdx];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctAnswer;

            return (
              <div
                key={q.id || qIdx}
                className={cn(
                  "p-5 rounded-xl border transition-all bg-slate-900/40",
                  isSubmitted
                    ? isCorrect
                      ? "border-emerald-800/60 bg-emerald-950/10"
                      : "border-rose-800/60 bg-rose-950/10"
                    : isAnswered
                    ? "border-cyan-500/40"
                    : "border-slate-800"
                )}
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-100 leading-snug">
                      {q.question}
                    </h3>

                    {/* Optional Code Snippet in Question */}
                    {q.codeSnippet && (
                      <pre className="mt-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
                        <code>{q.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                </div>

                {/* Option Cards */}
                <div className="space-y-2 mt-4 pl-9">
                  {q.options.map((option, optIdx) => {
                    const isOptionSelected = selectedOpt === optIdx;
                    const isOptionCorrect = q.correctAnswer === optIdx;

                    let cardStyle =
                      "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60";

                    if (isSubmitted) {
                      if (isOptionCorrect) {
                        cardStyle =
                          "border-emerald-500/70 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/50";
                      } else if (isOptionSelected && !isCorrect) {
                        cardStyle =
                          "border-rose-500/70 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500/50";
                      } else {
                        cardStyle = "border-slate-800/50 opacity-50 text-slate-500";
                      }
                    } else if (isOptionSelected) {
                      cardStyle =
                        "border-cyan-500 bg-cyan-950/50 text-cyan-200 ring-1 ring-cyan-500/50";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        disabled={isSubmitted}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border text-left text-xs transition-all relative",
                          cardStyle
                        )}
                      >
                        <span
                          className={cn(
                            "w-5 h-5 rounded-full border text-[10px] font-mono font-bold flex items-center justify-center shrink-0",
                            isSubmitted && isOptionCorrect
                              ? "bg-emerald-500 text-slate-950 border-emerald-400"
                              : isSubmitted && isOptionSelected && !isCorrect
                              ? "bg-rose-500 text-white border-rose-400"
                              : isOptionSelected
                              ? "bg-cyan-500 text-slate-950 border-cyan-400"
                              : "border-slate-700 text-slate-400"
                          )}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>

                        <span className="flex-1 leading-relaxed">{option}</span>

                        {isSubmitted && isOptionCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isSubmitted && isOptionSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card upon submit */}
                {isSubmitted && (
                  <div
                    className={cn(
                      "mt-4 p-3.5 rounded-xl border text-xs leading-relaxed ml-9",
                      isCorrect
                        ? "bg-emerald-950/30 border-emerald-800/50 text-emerald-300"
                        : "bg-rose-950/30 border-rose-800/50 text-rose-300"
                    )}
                  >
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      {isCorrect ? (
                        <span>✅ คำตอบถูกต้อง!</span>
                      ) : (
                        <span>❌ คำตอบยังไม่ถูกต้อง</span>
                      )}
                    </div>
                    <p className="opacity-90">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Quiz Button */}
        {!isSubmitted && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={calculateScore}
              disabled={!isAllAnswered}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs shadow-xl transition-all",
                isAllAnswered
                  ? "bg-gradient-to-r from-teal-500 via-cyan-400 to-brand-400 text-slate-950 hover:opacity-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02]"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
              )}
            >
              <span>ส่งคำตอบเพื่อตรวจผล</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
