"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useAuth } from "./auth-context";
import { Certificate, UserProfile } from "@/types";
import { generateVerificationCode } from "./utils";

interface ProgressContextType {
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  getCourseProgress: (courseId: string, totalLessons: number) => number;
  completeLesson: (courseId: string, lessonId: string, xpReward?: number) => void;
  saveQuizScore: (courseId: string, lessonId: string, score: number) => void;
  getQuizScore: (courseId: string, lessonId: string) => number | undefined;
  saveLessonNote: (courseId: string, lessonId: string, note: string) => void;
  getLessonNote: (courseId: string, lessonId: string) => string;
  isBookmarked: (courseId: string) => boolean;
  toggleBookmark: (courseId: string) => void;
  enrollInCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  certificates: Certificate[];
  claimCertificate: (courseId: string, courseTitle: string, skills: string[]) => Certificate;
  triggerConfetti: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const CERTS_KEY = "ktech_certificates";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { profile, updateGuestProfile } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCerts = localStorage.getItem(CERTS_KEY);
      if (savedCerts) {
        try {
          setCertificates(JSON.parse(savedCerts));
        } catch {
          setCertificates([]);
        }
      }
    }
  }, []);

  const triggerConfetti = () => {
    if (typeof window !== "undefined") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00f0ff", "#14b8a6", "#a855f7", "#ec4899", "#f59e0b"],
      });
    }
  };

  const isLessonCompleted = (courseId: string, lessonId: string) => {
    if (!profile) return false;
    const key = `${courseId}:${lessonId}`;
    return profile.completedLessons.includes(key);
  };

  const getCourseProgress = (courseId: string, totalLessons: number) => {
    if (!profile || totalLessons === 0) return 0;
    const completedCount = profile.completedLessons.filter((item) =>
      item.startsWith(`${courseId}:`)
    ).length;
    return Math.min(100, Math.round((completedCount / totalLessons) * 100));
  };

  const completeLesson = (courseId: string, lessonId: string, xpReward = 50) => {
    if (!profile) return;
    const key = `${courseId}:${lessonId}`;
    if (!profile.completedLessons.includes(key)) {
      const updatedCompleted = [...profile.completedLessons, key];
      const newXp = profile.xp + xpReward;
      const enrolled = profile.enrolledCourses.includes(courseId)
        ? profile.enrolledCourses
        : [...profile.enrolledCourses, courseId];

      updateGuestProfile({
        completedLessons: updatedCompleted,
        xp: newXp,
        enrolledCourses: enrolled,
        lastActiveDate: new Date().toISOString(),
      });
      triggerConfetti();
    }
  };

  const saveQuizScore = (courseId: string, lessonId: string, score: number) => {
    if (!profile) return;
    const key = `${courseId}:${lessonId}`;
    const updatedScores = { ...profile.quizScores, [key]: score };
    let xpBonus = 0;
    if (score >= 80) xpBonus = 100;
    else if (score >= 50) xpBonus = 50;

    updateGuestProfile({
      quizScores: updatedScores,
      xp: profile.xp + xpBonus,
    });
    if (score >= 80) {
      triggerConfetti();
    }
  };

  const getQuizScore = (courseId: string, lessonId: string) => {
    if (!profile) return undefined;
    const key = `${courseId}:${lessonId}`;
    return profile.quizScores[key];
  };

  const saveLessonNote = (courseId: string, lessonId: string, note: string) => {
    if (!profile) return;
    const key = `${courseId}:${lessonId}`;
    const updatedNotes = { ...profile.notes, [key]: note };
    updateGuestProfile({ notes: updatedNotes });
  };

  const getLessonNote = (courseId: string, lessonId: string) => {
    if (!profile) return "";
    const key = `${courseId}:${lessonId}`;
    return profile.notes[key] || "";
  };

  const isBookmarked = (courseId: string) => {
    return profile?.bookmarks.includes(courseId) || false;
  };

  const toggleBookmark = (courseId: string) => {
    if (!profile) return;
    const exists = profile.bookmarks.includes(courseId);
    const updated = exists
      ? profile.bookmarks.filter((id) => id !== courseId)
      : [...profile.bookmarks, courseId];
    updateGuestProfile({ bookmarks: updated });
  };

  const enrollInCourse = (courseId: string) => {
    if (!profile) return;
    if (!profile.enrolledCourses.includes(courseId)) {
      updateGuestProfile({
        enrolledCourses: [...profile.enrolledCourses, courseId],
      });
    }
  };

  const isEnrolled = (courseId: string) => {
    return profile?.enrolledCourses.includes(courseId) || false;
  };

  const claimCertificate = (courseId: string, courseTitle: string, skills: string[]) => {
    const studentName = profile?.displayName || "K-Tech Student";
    const verificationCode = generateVerificationCode(courseId, profile?.uid || "guest");
    const newCert: Certificate = {
      id: `cert-${Date.now().toString(36)}`,
      courseId,
      courseTitle,
      studentName,
      issueDate: new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      verificationCode,
      grade: "เกียรตินิยม (Distinction)",
      skills,
    };

    const updated = [newCert, ...certificates.filter((c) => c.courseId !== courseId)];
    setCertificates(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(CERTS_KEY, JSON.stringify(updated));
    }
    triggerConfetti();
    return newCert;
  };

  return (
    <ProgressContext.Provider
      value={{
        isLessonCompleted,
        getCourseProgress,
        completeLesson,
        saveQuizScore,
        getQuizScore,
        saveLessonNote,
        getLessonNote,
        isBookmarked,
        toggleBookmark,
        enrollInCourse,
        isEnrolled,
        certificates,
        claimCertificate,
        triggerConfetti,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
