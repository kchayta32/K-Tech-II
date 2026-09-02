import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} นาที`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} ชม. ${remainingMinutes} นาที` : `${hours} ชั่วโมง`;
}

export function generateVerificationCode(courseId: string, userId: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const hash = Math.random().toString(36).substring(2, 6).toUpperCase();
  const cPrefix = courseId.substring(0, 3).toUpperCase();
  return `KT-${cPrefix}-${timestamp}-${hash}`;
}

export function calculateLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number; progress: number } {
  // 100 XP per level scaling
  const level = Math.floor(xp / 250) + 1;
  const currentXp = xp % 250;
  const nextLevelXp = 250;
  const progress = Math.min(100, Math.round((currentXp / nextLevelXp) * 100));
  return { level, currentXp, nextLevelXp, progress };
}
