"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Award,
  Download,
  Share2,
  X,
  CheckCircle,
  Copy,
  Printer,
  Sparkles,
  ShieldCheck,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { useProgress } from "@/lib/progress-context";
import { generateVerificationCode } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  courseId: string;
  studentName?: string;
  issueDate?: string;
  verificationCode?: string;
  skills?: string[];
  grade?: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  courseTitle,
  courseId,
  studentName,
  issueDate,
  verificationCode,
  skills = ["Full-Stack Architecture", "Next.js 14", "TypeScript", "Microservices"],
  grade = "เกียรตินิยม (Distinction)",
}: CertificateModalProps) {
  const { profile } = useAuth();
  const { triggerConfetti } = useProgress();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const actualStudentName = studentName || profile?.displayName || "K-Tech Graduate";
  const actualDate =
    issueDate ||
    new Date().toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const actualCode =
    verificationCode ||
    generateVerificationCode(courseId, profile?.uid || "guest");

  // Trigger confetti when modal opens
  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
      renderCertificateCanvas();
    }
  }, [isOpen, courseTitle, actualStudentName, actualCode]);

  // Render High-Resolution Certificate on Canvas
  const renderCertificateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Gradient (Dark Cyber Slate)
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, "#0b0f19");
    bgGradient.addColorStop(0.5, "#0f172a");
    bgGradient.addColorStop(1, "#020617");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Guilloche / Tech Border pattern
    ctx.strokeStyle = "rgba(20, 184, 166, 0.4)";
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, width - 100, height - 100);

    ctx.strokeStyle = "rgba(0, 240, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(65, 65, width - 130, height - 130);

    // Corner decorative brackets
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.stroke();
      ctx.restore();
    };

    drawCorner(70, 70, 0);
    drawCorner(width - 70, 70, 90);
    drawCorner(width - 70, height - 70, 180);
    drawCorner(70, height - 70, 270);

    // 3. Institution Header
    ctx.textAlign = "center";
    ctx.fillStyle = "#00f0ff";
    ctx.font = "bold 28px 'JetBrains Mono', sans-serif";
    ctx.fillText("K-TECH ADVANCED DIGITAL LEARNING ACADEMY", width / 2, 160);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "600 18px 'Inter', sans-serif";
    ctx.fillText(
      "CERTIFICATE OF COMPLETION & PROFESSIONAL MASTERY",
      width / 2,
      195
    );

    // Thin separator line with diamond
    ctx.strokeStyle = "rgba(45, 212, 191, 0.5)";
    ctx.beginPath();
    ctx.moveTo(width / 2 - 250, 225);
    ctx.lineTo(width / 2 + 250, 225);
    ctx.stroke();

    // 4. "This is proudly presented to"
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "italic 22px 'Inter', sans-serif";
    ctx.fillText("ขอรับรองว่าประกาศนียบัตรฉบับนี้มอบให้แก่", width / 2, 290);

    // 5. Student Name (Bold Glowing Typography)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 56px 'Inter', sans-serif";
    ctx.shadowColor = "rgba(0, 240, 255, 0.6)";
    ctx.shadowBlur = 20;
    ctx.fillText(actualStudentName, width / 2, 380);
    ctx.shadowBlur = 0; // reset shadow

    // 6. "For successfully completing course"
    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px 'Inter', sans-serif";
    ctx.fillText(
      "ได้สำเร็จการศึกษาตามหลักสูตรการเรียนรู้เชิงลึกภาคปฏิบัติ",
      width / 2,
      450
    );

    // 7. Course Title
    ctx.fillStyle = "#2dd4bf";
    ctx.font = "bold 42px 'Inter', sans-serif";
    ctx.fillText(`“ ${courseTitle} ”`, width / 2, 530);

    // Grade / Distinction badge text
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 22px 'Inter', sans-serif";
    ctx.fillText(`เกรดประเมินผล: ${grade}`, width / 2, 580);

    // 8. Skills acquired tags
    ctx.fillStyle = "#64748b";
    ctx.font = "16px 'JetBrains Mono', sans-serif";
    ctx.fillText(`ทักษะที่ผ่านการรับรอง: ${skills.join("  •  ")}`, width / 2, 630);

    // 9. Bottom Signatures & Seal Section
    const leftSigX = 380;
    const rightSigX = width - 380;
    const sigY = 820;

    // Director Signature Line
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftSigX - 160, sigY);
    ctx.lineTo(leftSigX + 160, sigY);
    ctx.stroke();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.fillText("Dr. Kitti Ph.D.", leftSigX, sigY + 35);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText("Academic Director, K-Tech MOOC", leftSigX, sigY + 65);

    // Instructor Signature Line
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rightSigX - 160, sigY);
    ctx.lineTo(rightSigX + 160, sigY);
    ctx.stroke();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.fillText("Tech Lead & Instructor", rightSigX, sigY + 35);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px 'Inter', sans-serif";
    ctx.fillText("Senior Principal Architect", rightSigX, sigY + 65);

    // Official Gold/Teal Seal in Center
    const sealX = width / 2;
    const sealY = 820;

    ctx.save();
    ctx.beginPath();
    ctx.arc(sealX, sealY, 70, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(20, 184, 166, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "#14b8a6";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(sealX, sealY, 58, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 240, 255, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#00f0ff";
    ctx.font = "bold 14px 'JetBrains Mono', sans-serif";
    ctx.fillText("K-TECH SEAL", sealX, sealY - 12);
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 13px 'JetBrains Mono', sans-serif";
    ctx.fillText("VERIFIED", sealX, sealY + 12);
    ctx.fillStyle = "#34d399";
    ctx.font = "11px 'JetBrains Mono', sans-serif";
    ctx.fillText("★ 100% ★", sealX, sealY + 30);
    ctx.restore();

    // 10. Footer Metadata: Issue Date, Verification ID
    ctx.textAlign = "left";
    ctx.fillStyle = "#64748b";
    ctx.font = "15px 'JetBrains Mono', sans-serif";
    ctx.fillText(`วันที่ออกเอกสาร: ${actualDate}`, 120, height - 90);
    ctx.fillText(`รหัสตรวจสอบ (Credential ID): ${actualCode}`, 120, height - 65);

    ctx.textAlign = "right";
    ctx.fillText(`Verify at: https://k-tech.io/verify/${actualCode}`, width - 120, height - 75);
  };

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `ktech-certificate-${actualCode}.png`;
      a.click();
      setIsGenerating(false);
    }, 300);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify/${actualCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl bg-slate-900/95 border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-slate-100">
                ใบประกาศนียบัตรสำเร็จการศึกษา (Official Certificate)
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Credential ID: {actualCode}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Preview Canvas Area */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center bg-slate-950/70">
          <div className="w-full max-w-4xl aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Verification info pill */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>ใบรับรองดิจิทัลผ่านการตรวจสอบโดย K-Tech MOOC</span>
            </span>
            <span>•</span>
            <span className="font-mono text-cyan-300">
              {actualDate}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">คัดลอกลิงก์แล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>คัดลอกลิงก์ตรวจสอบ</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 text-xs font-medium transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-400" />
              <span>พิมพ์ / บันทึก PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              ปิด
            </button>

            <button
              onClick={handleDownloadPNG}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? "กำลังสร้างรูปภาพ..." : "ดาวน์โหลดภาพ PNG (1080p)"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
