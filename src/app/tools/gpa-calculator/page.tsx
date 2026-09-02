"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { 
  Calculator, 
  User, 
  GraduationCap, 
  Award, 
  Printer, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  RotateCcw, 
  Download, 
  FileText, 
  BarChart3, 
  Target, 
  ArrowLeft,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface CourseRow {
  id: string;
  code: string;
  name: string;
  credits: number;
  prerequisites: string;
  corequisites: string;
  grade: string;
}

const GRADE_POINTS: Record<string, number> = {
  "A": 4.0,
  "B+": 3.5,
  "B": 3.0,
  "C+": 2.5,
  "C": 2.0,
  "D+": 1.5,
  "D": 1.0,
  "F": 0.0,
  "W": -1, // Not counted
  "S": -2, // Satisfactory (Earned credits, no GPA weight)
  "U": -3, // Unsatisfactory (No credits, no GPA weight)
};

const DEFAULT_COURSES: CourseRow[] = [
  {
    id: "c1",
    code: "KT-FE101",
    name: "Svelte 5 & SvelteKit Web Engineering",
    credits: 3,
    prerequisites: "None",
    corequisites: "None",
    grade: "A",
  },
  {
    id: "c2",
    code: "KT-TS201",
    name: "Advanced TypeScript & Type Systems",
    credits: 3,
    prerequisites: "KT-FE101",
    corequisites: "None",
    grade: "A",
  },
  {
    id: "c3",
    code: "KT-BE301",
    name: "NestJS Microservices & Prisma ORM",
    credits: 4,
    prerequisites: "KT-TS201",
    corequisites: "None",
    grade: "B+",
  },
  {
    id: "c4",
    code: "KT-DT401",
    name: "Distributed Apache Kafka & Event Streams",
    credits: 3,
    prerequisites: "KT-BE301",
    corequisites: "None",
    grade: "A",
  },
  {
    id: "c5",
    code: "KT-AI501",
    name: "OpenAI & Claude LLM Agent Architectures",
    credits: 3,
    prerequisites: "KT-BE301",
    corequisites: "None",
    grade: "A",
  },
];

export default function GPACalculatorPage() {
  const { profile } = useAuth();

  // Student Info State
  const [studentName, setStudentName] = useState(profile?.displayName || "Bashar Abdullah");
  const [studentId, setStudentId] = useState("160100000");
  const [major, setMajor] = useState("Computer Engineering & AI Systems");
  const [semester, setSemester] = useState("ภาคเรียนที่ 1 / 2569");

  // Courses List State
  const [courses, setCourses] = useState<CourseRow[]>(DEFAULT_COURSES);

  // Target GPA Simulator State
  const [targetGPA, setTargetGPA] = useState<number>(3.80);
  const [futureCredits, setFutureCredits] = useState<number>(18);

  const printableRef = useRef<HTMLDivElement>(null);

  // Calculations
  const stats = useMemo(() => {
    let attemptedCredits = 0;
    let earnedCredits = 0;
    let totalQualityPoints = 0;
    let gpaCredits = 0;

    courses.forEach((c) => {
      const cr = Number(c.credits) || 0;
      attemptedCredits += cr;

      const pts = GRADE_POINTS[c.grade];
      if (pts !== undefined) {
        if (pts >= 0) {
          // Standard A to F
          gpaCredits += cr;
          totalQualityPoints += pts * cr;
          if (pts > 0) {
            earnedCredits += cr;
          }
        } else if (pts === -2) {
          // S grade
          earnedCredits += cr;
        }
      }
    });

    const gpa = gpaCredits > 0 ? (totalQualityPoints / gpaCredits) : 0.0;
    const roundedGPA = Math.round(gpa * 100) / 100;

    // Academic Honor Standing
    let standing = "กำลังศึกษาตามปกติ (Good Standing)";
    let badgeColor = "bg-teal-500/10 text-teal-400 border-teal-500/30";
    if (roundedGPA >= 3.60 && roundedGPA <= 4.00) {
      standing = "🏆 เกียรตินิยมอันดับ 1 (First Class Distinction)";
      badgeColor = "bg-amber-500/10 text-amber-300 border-amber-500/40";
    } else if (roundedGPA >= 3.25) {
      standing = "🥈 เกียรตินิยมอันดับ 2 (Second Class Distinction)";
      badgeColor = "bg-cyan-500/10 text-cyan-300 border-cyan-500/40";
    } else if (roundedGPA < 2.00 && attemptedCredits > 0) {
      standing = "⚠️ เฝ้าระวังผลการเรียน (Academic Probation)";
      badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/40";
    }

    return {
      attemptedCredits,
      earnedCredits,
      totalQualityPoints: Math.round(totalQualityPoints * 10) / 10,
      gpa: roundedGPA.toFixed(2),
      rawGpa: roundedGPA,
      standing,
      badgeColor,
    };
  }, [courses]);

  // Target GPA calculation
  const targetRequiredGPA = useMemo(() => {
    if (futureCredits <= 0) return 0;
    const currentPoints = stats.totalQualityPoints;
    const currentCredits = courses.reduce((acc, c) => (GRADE_POINTS[c.grade] >= 0 ? acc + c.credits : acc), 0);
    const targetTotalPoints = targetGPA * (currentCredits + futureCredits);
    const neededPoints = targetTotalPoints - currentPoints;
    const neededGPA = neededPoints / futureCredits;
    return Math.round(neededGPA * 100) / 100;
  }, [stats, targetGPA, futureCredits, courses]);

  // Handlers
  const handleAddCourse = () => {
    const newCourse: CourseRow = {
      id: `c-${Date.now()}`,
      code: `KT-${Math.floor(100 + Math.random() * 900)}`,
      name: "ชื่อวิชาใหม่ (Course Title)",
      credits: 3,
      prerequisites: "-",
      corequisites: "-",
      grade: "A",
    };
    setCourses([...courses, newCourse]);
  };

  const handleRemoveCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const handleUpdateCourse = (id: string, field: keyof CourseRow, value: any) => {
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleReset = () => {
    if (window.confirm("คุณต้องการรีเซ็ตข้อมูลรายวิชาทั้งหมดหรือไม่?")) {
      setCourses(DEFAULT_COURSES);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Breadcrumb & Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 print:hidden">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              <Link href="/" className="hover:text-teal-400">หน้าแรก</Link>
              <span>/</span>
              <Link href="/dashboard" className="hover:text-teal-400">แดชบอร์ด</Link>
              <span>/</span>
              <span className="text-teal-400 font-semibold">K-Tech GPA & Credit Calculator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-teal-500/20">
                <Calculator className="w-6 h-6" />
              </div>
              <span>ระบบคำนวณเกรดเฉลี่ย & หน่วยกิตสะสม</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              คำนวณ GPA, GPAX, หน่วยกิตสะสม, คุณภาพคะแนน (Quality Points) พร้อมจำลองเกรดเป้าหมายในอนาคต
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>รีเซ็ต</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ใบบันทึกผลการเรียน</span>
            </button>
          </div>
        </div>

        {/* Top 2-Column Summary Cards: Student Info & Real-Time GPA Score Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:grid-cols-1">
          {/* Left Card: Student Information Form */}
          <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
            <div className="flex items-center justify-between mb-5 border-b border-slate-800/60 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-teal-400" />
                <span>ข้อมูลนักศึกษา (Student Information)</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">K-Tech Academic Profile</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Student Name */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold block">ชื่อ-นามสกุล (Student Name):</label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Bashar Abdullah"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>
              </div>

              {/* Student ID */}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-semibold block">รหัสนักศึกษา (Student ID):</label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 160100000"
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-mono font-medium focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                  />
                </div>
              </div>

              {/* Major Selection */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-slate-400 font-semibold block">สาขาวิชาเอก (Major / Track):</label>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                >
                  <option value="Computer Engineering & AI Systems">Computer Engineering & AI Systems (วิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์)</option>
                  <option value="Full-Stack Software Architecture">Full-Stack Software Architecture (วิศวกรรมซอฟต์แวร์ฟูลสแตก)</option>
                  <option value="Cloud Platform & DevOps Engineering">Cloud Platform & DevOps Engineering (วิศวกรรมคลาวด์และเดฟออปส์)</option>
                  <option value="Big Data Engineering & Distributed Systems">Big Data Engineering & Distributed Systems (วิศวกรรมข้อมูลขนาดใหญ่)</option>
                  <option value="Cybersecurity & Network Systems">Cybersecurity & Network Systems (ความมั่นคงปลอดภัยไซเบอร์)</option>
                </select>
              </div>

              {/* Semester */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-slate-400 font-semibold block">ภาคการศึกษา (Academic Term):</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. ภาคเรียนที่ 1 / 2569"
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Right Card: GPA Real-Time Metrics & Honor Status */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  สรุปผลการเรียน (Academic Score)
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${stats.badgeColor}`}>
                  {stats.standing.split(" ")[0]}
                </span>
              </div>

              {/* Huge GPA Display Meter */}
              <div className="flex items-center gap-5 my-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 shadow-inner">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex flex-col items-center justify-center text-slate-950 font-mono shadow-lg shadow-teal-500/20 shrink-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">GPA</span>
                  <span className="text-3xl font-black">{stats.gpa}</span>
                  <span className="text-[9px] font-bold opacity-80">/ 4.00</span>
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    สถานะ: <span className="text-teal-300">{stats.standing}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    คำนวณจากรายวิชาที่ลงทะเบียนทั้งหมด {courses.length} วิชา
                  </p>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-1">Attempted</div>
                  <div className="text-base font-extrabold font-mono text-white">
                    {stats.attemptedCredits} <span className="text-[10px] font-normal text-slate-400">นก.</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-1">Earned</div>
                  <div className="text-base font-extrabold font-mono text-teal-300">
                    {stats.earnedCredits} <span className="text-[10px] font-normal text-slate-400">นก.</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-1">Quality Pts</div>
                  <div className="text-base font-extrabold font-mono text-cyan-300">
                    {stats.totalQualityPoints}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span>เกณฑ์เกียรตินิยม: ≥ 3.60</span>
              <span className="font-mono text-teal-400 font-semibold">100% Verified</span>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Course Table */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <span>ตารางบันทึกรายวิชาและเกรด (Course & Grade Table)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                เพิ่ม ลบ หรือแก้ไขรหัสวิชา หน่วยกิต และเกรด เพื่อคำนวณคะแนนแบบ Real-time
              </p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handleAddCourse}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-500/10 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มรายวิชา</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-inner">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 min-w-[120px]">Course Code</th>
                  <th className="py-3.5 px-4 min-w-[240px]">Course Name</th>
                  <th className="py-3.5 px-4 w-28 text-center">Credits (นก.)</th>
                  <th className="py-3.5 px-4 min-w-[130px]">Prerequisites</th>
                  <th className="py-3.5 px-4 min-w-[130px]">Co-requisites</th>
                  <th className="py-3.5 px-4 w-28 text-center">Grade</th>
                  <th className="py-3.5 px-4 w-28 text-center">Quality Pts</th>
                  <th className="py-3.5 px-4 w-20 text-center print:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {courses.map((course, idx) => {
                  const pts = GRADE_POINTS[course.grade];
                  const qPoints = pts !== undefined && pts >= 0 ? (pts * course.credits).toFixed(1) : "-";

                  return (
                    <tr key={course.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-500">{idx + 1}</td>
                      
                      {/* Course Code */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={course.code}
                          onChange={(e) => handleUpdateCourse(course.id, "code", e.target.value)}
                          className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-teal-400"
                        />
                      </td>

                      {/* Course Name */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={course.name}
                          onChange={(e) => handleUpdateCourse(course.id, "name", e.target.value)}
                          className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-400"
                        />
                      </td>

                      {/* Credits */}
                      <td className="py-3 px-4 text-center">
                        <select
                          value={course.credits}
                          onChange={(e) => handleUpdateCourse(course.id, "credits", Number(e.target.value))}
                          className="bg-slate-900/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-teal-400"
                        >
                          <option value={1}>1 นก.</option>
                          <option value={2}>2 นก.</option>
                          <option value={3}>3 นก.</option>
                          <option value={4}>4 นก.</option>
                          <option value={5}>5 นก.</option>
                          <option value={6}>6 นก.</option>
                        </select>
                      </td>

                      {/* Prerequisites */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={course.prerequisites}
                          onChange={(e) => handleUpdateCourse(course.id, "prerequisites", e.target.value)}
                          className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 focus:outline-none focus:border-teal-400"
                        />
                      </td>

                      {/* Co-requisites */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={course.corequisites}
                          onChange={(e) => handleUpdateCourse(course.id, "corequisites", e.target.value)}
                          className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 focus:outline-none focus:border-teal-400"
                        />
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-4 text-center">
                        <select
                          value={course.grade}
                          onChange={(e) => handleUpdateCourse(course.id, "grade", e.target.value)}
                          className={`bg-slate-900 border rounded-lg px-3 py-1.5 text-xs font-bold font-mono focus:outline-none ${
                            course.grade === 'A' ? 'text-emerald-400 border-emerald-500/50' :
                            course.grade === 'B+' || course.grade === 'B' ? 'text-cyan-400 border-cyan-500/50' :
                            course.grade === 'C+' || course.grade === 'C' ? 'text-amber-400 border-amber-500/50' :
                            course.grade === 'F' ? 'text-rose-400 border-rose-500/50' :
                            'text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="A">A (4.0)</option>
                          <option value="B+">B+ (3.5)</option>
                          <option value="B">B (3.0)</option>
                          <option value="C+">C+ (2.5)</option>
                          <option value="C">C (2.0)</option>
                          <option value="D+">D+ (1.5)</option>
                          <option value="D">D (1.0)</option>
                          <option value="F">F (0.0)</option>
                          <option value="W">W (ถอน)</option>
                          <option value="S">S (ผ่าน)</option>
                          <option value="U">U (ไม่ผ่าน)</option>
                        </select>
                      </td>

                      {/* Quality Points */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-teal-300">
                        {qPoints}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center print:hidden">
                        <button
                          onClick={() => handleRemoveCourse(course.id)}
                          title="ลบรายวิชานี้"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Target GPA Simulator & Forecasting */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">ระบบจำลองเกรดเฉลี่ยเป้าหมาย (Target GPA Simulator)</h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            คำนวณว่าในภาคเรียนถัดไป คุณต้องทำเกรดเฉลี่ยขั้นต่ำเท่าไร เพื่อให้ได้ GPAX ตามเป้าหมายที่ต้องการ
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1.5">GPAX เป้าหมายที่ต้องการ:</label>
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="4.0"
                value={targetGPA}
                onChange={(e) => setTargetGPA(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1.5">จำนวนหน่วยกิตในเทอมหน้า:</label>
              <input
                type="number"
                min="1"
                max="30"
                value={futureCredits}
                onChange={(e) => setFutureCredits(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-center">
              <div className="text-[11px] text-slate-400 mb-1">เกรดเฉลี่ยที่ต้องทำให้ได้ในเทอมหน้า:</div>
              <div className={`text-2xl font-black font-mono ${
                targetRequiredGPA <= 4.0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {targetRequiredGPA > 4.0 ? '> 4.00 (เป็นไปไม่ได้)' : targetRequiredGPA.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {targetRequiredGPA <= 4.0 ? '✓ อยู่ในเกณฑ์ที่ทำได้' : '⚠️ เกินขีดจำกัดเกรดสูงสุด'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
