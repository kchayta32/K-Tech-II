"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  BookOpen, 
  Code2, 
  HelpCircle, 
  StickyNote, 
  Award, 
  Menu, 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Maximize2,
  Minimize2
} from "lucide-react";
import { getCourseById, getCourseBySlug, getNextLesson, getPrevLesson } from "@/data";
import { ClassroomSidebar } from "@/components/classroom/ClassroomSidebar";
import { MarkdownViewer } from "@/components/classroom/MarkdownViewer";
import { CodeEditorPanel } from "@/components/classroom/CodeEditorPanel";
import { QuizPanel } from "@/components/classroom/QuizPanel";
import { NotesDrawer } from "@/components/classroom/NotesDrawer";
import { CertificateModal } from "@/components/certificate/CertificateModal";
import { useProgress } from "@/lib/progress-context";

export default function ClassroomLearnPage() {
  const params = useParams();
  const router = useRouter();
  const courseParam = params.courseId as string;
  const lessonParam = params.lessonId as string;

  const course = getCourseById(courseParam) || getCourseBySlug(courseParam);
  
  // Find current lesson and module
  let currentLesson = null;
  let currentModuleTitle = "";
  if (course) {
    for (const mod of course.modules) {
      const found = mod.lessons.find((l) => l.id === lessonParam);
      if (found) {
        currentLesson = found;
        currentModuleTitle = mod.title;
        break;
      }
    }
  }

  // Active Main View Tab
  const [activeTab, setActiveTab] = useState<"reading" | "exercise" | "quiz">("reading");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [notesOpen, setNotesOpen] = useState<boolean>(false);
  const [certModalOpen, setCertModalOpen] = useState<boolean>(false);

  const { isLessonCompleted, completeLesson, getCourseProgress, isEnrolled, enrollInCourse } = useProgress();

  useEffect(() => {
    if (course) {
      enrollInCourse(course.id);
    }
  }, [course]);

  // Set default tab based on lesson type
  useEffect(() => {
    if (currentLesson) {
      if (currentLesson.exercise) {
        setActiveTab("exercise");
      } else if (currentLesson.quiz && currentLesson.quiz.length > 0) {
        setActiveTab("quiz");
      } else {
        setActiveTab("reading");
      }
    }
  }, [currentLesson?.id]);

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center text-slate-200 p-4">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl max-w-md text-center">
          <BookOpen className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">ไม่พบบทเรียนที่ต้องการ</h2>
          <p className="text-xs text-slate-400 mb-6">
            บทเรียนนี้อาจถูกย้ายหรือไม่มีอยู่ในระบบ K-Tech
          </p>
          <Link
            href="/courses"
            className="px-5 py-2.5 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-teal-400 transition-colors"
          >
            กลับสู่หน้ารายการหลักสูตร
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const courseProgress = getCourseProgress(course.id, totalLessons);
  const isComplete = isLessonCompleted(course.id, currentLesson.id);

  const nextLessonInfo = getNextLesson(course.id, currentLesson.id);
  const prevLessonInfo = getPrevLesson(course.id, currentLesson.id);

  const handleNext = () => {
    if (nextLessonInfo) {
      router.push(`/courses/${course.slug || course.id}/learn/${nextLessonInfo.lessonId}`);
    }
  };

  const handlePrev = () => {
    if (prevLessonInfo) {
      router.push(`/courses/${course.slug || course.id}/learn/${prevLessonInfo.lessonId}`);
    }
  };

  const handleMarkComplete = () => {
    completeLesson(course.id, currentLesson.id, 50);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#090d16] overflow-hidden">
      {/* Sidebar */}
      <ClassroomSidebar
        course={course}
        currentLessonId={currentLesson.id}
        onSelectLesson={(lessonId) => {
          router.push(`/courses/${course.slug || course.id}/learn/${lessonId}`);
        }}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Classroom Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 relative">
        {/* Top Classroom Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-300 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <span className="font-semibold text-white line-clamp-1">
              {currentModuleTitle} · <span className="text-teal-400">{currentLesson.title}</span>
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("reading")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "reading"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>เนื้อหา</span>
            </button>

            {currentLesson.exercise && (
              <button
                onClick={() => setActiveTab("exercise")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "exercise"
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code Lab</span>
              </button>
            )}

            {currentLesson.quiz && currentLesson.quiz.length > 0 && (
              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "quiz"
                    ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quiz ({currentLesson.quiz.length})</span>
              </button>
            )}
          </div>

          {/* Right Tools: Notes & Certificate */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/60 transition-colors"
            >
              <StickyNote className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">สมุดโน้ต</span>
            </button>

            {courseProgress >= 80 && (
              <button
                onClick={() => setCertModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 animate-pulse"
              >
                <Award className="w-3.5 h-3.5" />
                <span>รับใบประกาศนียบัตร</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Center Pane */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === "reading" ? (
            <MarkdownViewer
              lesson={currentLesson}
              onNextLesson={handleNext}
              onPrevLesson={handlePrev}
              hasNext={!!nextLessonInfo}
              hasPrev={!!prevLessonInfo}
              isCompleted={isComplete}
              onMarkCompleted={handleMarkComplete}
            />
          ) : activeTab === "exercise" && currentLesson.exercise ? (
            <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
              {/* Left Column: Lesson Instructions / Explanation */}
              <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-y-auto border-r border-slate-800 custom-scrollbar">
                <MarkdownViewer
                  lesson={currentLesson}
                  onNextLesson={handleNext}
                  onPrevLesson={handlePrev}
                  hasNext={!!nextLessonInfo}
                  hasPrev={!!prevLessonInfo}
                  isCompleted={isComplete}
                  onMarkCompleted={handleMarkComplete}
                />
              </div>
              {/* Right Column: Monaco Code Editor Runner */}
              <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-hidden">
                <CodeEditorPanel
                  exercise={currentLesson.exercise}
                  courseId={course.id}
                  lessonId={currentLesson.id}
                  onPass={handleNext}
                />
              </div>
            </div>
          ) : activeTab === "quiz" && currentLesson.quiz ? (
            <QuizPanel
              quiz={currentLesson.quiz}
              courseId={course.id}
              lessonId={currentLesson.id}
              onCompleted={() => {
                if (nextLessonInfo) {
                  setTimeout(handleNext, 1200);
                }
              }}
            />
          ) : (
            <MarkdownViewer
              lesson={currentLesson}
              onNextLesson={handleNext}
              onPrevLesson={handlePrev}
              hasNext={!!nextLessonInfo}
              hasPrev={!!prevLessonInfo}
              isCompleted={isComplete}
              onMarkCompleted={handleMarkComplete}
            />
          )}
        </div>
      </div>

      {/* Notes Drawer */}
      <NotesDrawer
        courseId={course.id}
        lessonId={currentLesson.id}
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
      />

      {/* Certificate Modal */}
      <CertificateModal
        course={course}
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
      />
    </div>
  );
}
