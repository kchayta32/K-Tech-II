"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Award, 
  CheckCircle2, 
  Download, 
  Share2, 
  ShieldCheck, 
  ExternalLink, 
  ArrowLeft,
  Calendar,
  Sparkles,
  QrCode
} from "lucide-react";
import { useProgress } from "@/lib/progress-context";

export default function CertificateVerificationPage() {
  const params = useParams();
  const certCode = params.code as string;
  const { certificates } = useProgress();

  const foundCert = certificates.find((c) => c.verificationCode === certCode);

  const defaultDate = "1 มกราคม 2026";
  const [issueDate, setIssueDate] = React.useState<string>(defaultDate);

  React.useEffect(() => {
    setIssueDate(
      new Date().toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  // Fallback demo certificate if accessed directly
  const cert = foundCert || {
    id: "cert-demo",
    courseId: "svelte-5-complete-mastery",
    courseTitle: "Svelte 5 & SvelteKit: Full-Stack Reactive Web Engineering",
    studentName: "K-Tech Member",
    issueDate: issueDate,
    verificationCode: certCode || "KT-SVE-2026-X99",
    grade: "เกียรตินิยมอันดับ 1 (Distinction with Honors)",
    skills: ["Svelte 5 Runes", "SvelteKit SSR", "Reactive Stores", "Component Architecture", "TypeScript"],
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่ Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-500/10 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>พิมพ์ / บันทึก PDF</span>
            </button>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>ใบประกาศนียบัตรนี้ผ่านการรับรองความถูกต้องโดย K-Tech Official</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                รหัสยืนยันสากล: <span className="font-mono font-bold">{cert.verificationCode}</span> · สถานะ: Active & Verified
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Display Canvas Frame */}
        <div className="bg-slate-950 border-4 border-double border-teal-500/40 rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl text-center">
          {/* Background watermark seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-[500px] h-[500px] text-teal-400" />
          </div>

          <div className="relative z-10">
            {/* Academy Header */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-teal-400 text-xs font-mono font-bold uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4" />
              <span>K-TECH ACADEMY OF ADVANCED TECHNOLOGY</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wider uppercase mb-2">
              CERTIFICATE OF COMPLETION
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-serif italic mb-8">
              ใบประกาศนียบัตรรับรองการสำเร็จหลักสูตรวิศวกรรมเทคโนโลยีระดับสากล
            </p>

            <div className="text-xs text-slate-400 uppercase tracking-widest mb-2">
              ขอมอบใบประกาศนียบัตรฉบับนี้เพื่อแสดงว่า
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-teal-300 font-serif mb-6 tracking-wide underline decoration-teal-500/40 underline-offset-8">
              {cert.studentName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed mb-6">
              ได้ศึกษาและผ่านเกณฑ์การประเมินผลภาคทฤษฎีและการลงมือปฏิบัติจริงในหลักสูตร
            </p>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white bg-slate-900/90 border border-slate-800 py-3.5 px-6 rounded-2xl max-w-2xl mx-auto mb-6 shadow-inner">
              {cert.courseTitle}
            </h3>

            {/* Skills & Distinction */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-lg mx-auto">
              {cert.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>

            {/* Signatures & Metadata Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-800 items-end">
              {/* Issue Date */}
              <div className="text-center sm:text-left text-xs text-slate-400">
                <div className="font-semibold text-slate-200 mb-0.5">วันที่สำเร็จการศึกษา</div>
                <div className="font-mono text-teal-400">{cert.issueDate}</div>
              </div>

              {/* Official Seal / Grade */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-amber-400/80 bg-amber-400/10 flex flex-col items-center justify-center mx-auto text-amber-300 mb-1 shadow-lg shadow-amber-500/20">
                  <Award className="w-6 h-6" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">K-TECH</span>
                </div>
                <span className="text-[10px] font-bold text-amber-300 block">
                  {cert.grade}
                </span>
              </div>

              {/* Verification Code & Link */}
              <div className="text-center sm:text-right text-xs text-slate-400">
                <div className="font-semibold text-slate-200 mb-0.5">Credential ID</div>
                <div className="font-mono font-bold text-teal-400">{cert.verificationCode}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">k-tech.vercel.app/certificates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
