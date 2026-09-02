import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ProgressProvider } from "@/lib/progress-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AITutorModal from "@/components/ai-tutor/AITutorModal";
import SearchModal from "@/components/layout/SearchModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "K-Tech | แพลตฟอร์มการเรียนรู้วิศวกรรมคอมพิวเตอร์และเทคโนโลยีขั้นสูง (MOOC)",
  description: "เรียนรู้วิทยาการคอมพิวเตอร์, Frontend, Backend, AI & ML, Data Processing, DevOps & Cloud พร้อม Interactive Code Runner และใบประกาศนียบัตร",
  keywords: ["K-Tech", "MOOC", "Svelte", "TypeScript", "D3.js", "NestJS", "GraphQL", "Python", "Kafka", "Redis", "Elasticsearch", "PostgreSQL", "Docker", "Kubernetes", "AI ML", "Cloud"],
  authors: [{ name: "K-Tech Academy", url: "https://k-tech.vercel.app/" }],
  openGraph: {
    title: "K-Tech - Modern Tech MOOC Platform",
    description: "แพลตฟอร์มการเรียนการสอนเทคโนโลยีระดับสูง สไตล์ MOOC มีลูกเล่น Interactive และแบบฝึกหัดเสมือนจริง",
    url: "https://k-tech.vercel.app/",
    siteName: "K-Tech",
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-teal-500 selection:text-white`}>
        <AuthProvider>
          <ProgressProvider>
            <Navbar />
            <SearchModal />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <AITutorModal />
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
