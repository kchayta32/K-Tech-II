export type CategoryId = 'frontend' | 'backend' | 'data' | 'ai-ml' | 'devops';

export interface Category {
  id: CategoryId;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  badgeColor: string;
  courseCount?: number;
}

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  codeSnippet?: string;
}

export interface ExerciseTest {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface Exercise {
  id: string;
  title: string;
  instructions: string;
  initialCode: string;
  solutionCode: string;
  language: 'javascript' | 'typescript' | 'python' | 'html' | 'sql';
  testCases?: ExerciseTest[];
  hints: string[];
}

export interface Lesson {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  durationMinutes: number;
  type: 'video' | 'reading' | 'interactive_code' | 'quiz' | 'project';
  contentMarkdown: string;
  exercise?: Exercise;
  quiz?: QuizQuestion[];
  visualizerType?: 'd3-chart' | 'kafka-stream' | 'k8s-cluster' | 'neural-net' | 'sql-visualizer';
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  tagline: string;
  description: string;
  categoryId: CategoryId;
  difficulty: CourseDifficulty;
  estimatedHours: number;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  rating: number;
  reviewsCount: number;
  enrolledStudents: number;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  badgeIcon: string;
  accentColor: string;
  featured?: boolean;
  modules: CourseModule[];
}

export interface RoadmapNode {
  id: string;
  title: string;
  category: string;
  description: string;
  level: number;
  courseId?: string;
  prerequisites: string[];
  status?: 'completed' | 'in_progress' | 'available' | 'locked';
}

export interface RoadmapTrack {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  color: string;
  targetRole: string;
  nodes: RoadmapNode[];
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest?: boolean;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  enrolledCourses: string[];
  completedLessons: string[]; // lesson ids formatted as `courseId:lessonId`
  quizScores: Record<string, number>; // `courseId:lessonId` -> score percentage
  completedCourses: string[];
  bookmarks: string[];
  notes: Record<string, string>; // `courseId:lessonId` -> user note
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAt: string;
  }[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issueDate: string;
  verificationCode: string;
  grade: string;
  skills: string[];
}
