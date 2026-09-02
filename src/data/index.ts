import { Category, CategoryId, Course, CourseDifficulty, Lesson, RoadmapTrack } from '@/types';
import { frontendCourses } from './courses/frontend';
import { backendCourses } from './courses/backend';
import { dataCourses } from './courses/data';
import { aimlCourses } from './courses/aiml';
import { devopsCourses } from './courses/devops';
import { roadmapTracks } from './roadmaps';

export * from './courses/frontend';
export * from './courses/backend';
export * from './courses/data';
export * from './courses/aiml';
export * from './courses/devops';
export * from './roadmaps';

export const allCourses: Course[] = [
  ...frontendCourses,
  ...backendCourses,
  ...dataCourses,
  ...aimlCourses,
  ...devopsCourses,
];

export const categories: Category[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    nameEn: 'Frontend & UI Engineering',
    description: 'พัฒนาเว็บอินเตอร์เฟซยุคใหม่ด้วย Svelte 5 Runes, TypeScript ขั้นสูง และ Interactive D3.js Visualization',
    icon: '⚡',
    color: '#FF3E00',
    gradient: 'from-orange-500 to-amber-500',
    badgeColor: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    courseCount: frontendCourses.length,
  },
  {
    id: 'backend',
    name: 'Backend & APIs',
    nameEn: 'Backend & Distributed APIs',
    description: 'ออกแบบระบบเซิร์ฟเวอร์สเกลใหญ่ด้วย NestJS, Modern Async Python, GraphQL และ Prisma ORM',
    icon: '🦁',
    color: '#E0234E',
    gradient: 'from-rose-500 to-red-600',
    badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    courseCount: backendCourses.length,
  },
  {
    id: 'data',
    name: 'Data & Processing',
    nameEn: 'Data Architecture & Streaming',
    description: 'จัดการฐานข้อมูลขั้นสูง PostgreSQL, MongoDB, Redis, Elasticsearch และ Distributed Streaming ด้วย Kafka',
    icon: '📊',
    color: '#336791',
    gradient: 'from-blue-600 to-cyan-500',
    badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    courseCount: dataCourses.length,
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    nameEn: 'AI Engineering & LLMs',
    description: 'สร้าง AI แอปพลิเคชันด้วย OpenAI & Claude APIs, RAG, Hugging Face Transformers และ Production ML Pipelines',
    icon: '🧠',
    color: '#10A37F',
    gradient: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    courseCount: aimlCourses.length,
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    nameEn: 'DevOps & Cloud Infrastructure',
    description: 'สร้างระบบคลาวด์และส่งมอบงานอัตโนมัติด้วย Docker, Kubernetes, Helm, GitHub Actions และ AWS/Azure',
    icon: '☸️',
    color: '#326CE5',
    gradient: 'from-indigo-500 to-sky-500',
    badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    courseCount: devopsCourses.length,
  },
];

// Helper Functions
export function getAllCourses(): Course[] {
  return allCourses;
}

export function getFeaturedCourses(): Course[] {
  return allCourses.filter((course) => course.featured);
}

export function getCourseById(id: string): Course | undefined {
  return allCourses.find((course) => course.id === id);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return allCourses.find((course) => course.slug === slug);
}

export function getCoursesByCategory(categoryId: CategoryId): Course[] {
  return allCourses.filter((course) => course.categoryId === categoryId);
}

export interface SearchCoursesOptions {
  category?: CategoryId;
  difficulty?: CourseDifficulty;
  tag?: string;
  sortBy?: 'popular' | 'rating' | 'newest';
}

export function searchCourses(query: string = '', options: SearchCoursesOptions = {}): Course[] {
  const normalizedQuery = query.toLowerCase().trim();

  return allCourses.filter((course) => {
    // กรองตามคำค้นหา
    if (normalizedQuery) {
      const matchTitle = course.title.toLowerCase().includes(normalizedQuery);
      const matchTitleEn = course.titleEn.toLowerCase().includes(normalizedQuery);
      const matchTagline = course.tagline.toLowerCase().includes(normalizedQuery);
      const matchDesc = course.description.toLowerCase().includes(normalizedQuery);
      const matchTags = course.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
      const matchInstructor = course.instructor.name.toLowerCase().includes(normalizedQuery);

      if (!matchTitle && !matchTitleEn && !matchTagline && !matchDesc && !matchTags && !matchInstructor) {
        return false;
      }
    }

    // กรองตามหมวดหมู่
    if (options.category && course.categoryId !== options.category) {
      return false;
    }

    // กรองตามระดับความยาก
    if (options.difficulty && course.difficulty !== options.difficulty) {
      return false;
    }

    // กรองตามแท็ก
    if (options.tag && !course.tags.includes(options.tag)) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (options.sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (options.sortBy === 'newest') {
      return b.enrolledStudents - a.enrolledStudents;
    }
    // Default: popular by enrolledStudents
    return b.enrolledStudents - a.enrolledStudents;
  });
}

export function getRoadmapTracks(): RoadmapTrack[] {
  return roadmapTracks;
}

export function getRoadmapByTrackId(trackId: string): RoadmapTrack | undefined {
  return roadmapTracks.find((track) => track.id === trackId);
}

export function getLessonById(
  courseId: string,
  lessonId: string
): { course: Course; lesson: Lesson; moduleTitle: string } | undefined {
  const course = getCourseById(courseId) || getCourseBySlug(courseId);
  if (!course) return undefined;

  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      return { course, lesson, moduleTitle: mod.title };
    }
  }

  return undefined;
}

export function getNextLesson(
  courseId: string,
  currentLessonId: string
): { lessonId: string; title: string } | null {
  const course = getCourseById(courseId) || getCourseBySlug(courseId);
  if (!course) return null;

  const allLessons: Lesson[] = [];
  for (const mod of course.modules) {
    allLessons.push(...mod.lessons);
  }

  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
    const next = allLessons[currentIndex + 1];
    return { lessonId: next.id, title: next.title };
  }

  return null;
}

export function getPrevLesson(
  courseId: string,
  currentLessonId: string
): { lessonId: string; title: string } | null {
  const course = getCourseById(courseId) || getCourseBySlug(courseId);
  if (!course) return null;

  const allLessons: Lesson[] = [];
  for (const mod of course.modules) {
    allLessons.push(...mod.lessons);
  }

  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex > 0) {
    const prev = allLessons[currentIndex - 1];
    return { lessonId: prev.id, title: prev.title };
  }

  return null;
}
