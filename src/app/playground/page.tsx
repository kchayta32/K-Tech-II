"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  FileCode, 
  Share2, 
  Code2, 
  Layout, 
  Download,
  Info
} from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 font-mono text-xs">
      กำลังโหลด Monaco Code Editor...
    </div>
  ),
});

const SNIPPETS: Record<string, { label: string; lang: string; code: string }> = {
  "ts-generics": {
    label: "TypeScript Generics & Utility Types",
    lang: "typescript",
    code: `// K-Tech TypeScript Playground
type CourseCategory = 'frontend' | 'backend' | 'ai-ml' | 'devops' | 'data';

interface Course<T extends CourseCategory> {
  id: string;
  title: string;
  category: T;
  rating: number;
}

// Generic filter function
function filterCourses<T extends CourseCategory>(
  courses: Course<T>[],
  minRating: number
): Course<T>[] {
  return courses.filter((c) => c.rating >= minRating);
}

const sampleCourses: Course<CourseCategory>[] = [
  { id: '1', title: 'Svelte 5 Runes', category: 'frontend', rating: 4.9 },
  { id: '2', title: 'Kafka Streams', category: 'data', rating: 4.8 },
  { id: '3', title: 'NestJS Microservices', category: 'backend', rating: 4.95 },
];

const topRated = filterCourses(sampleCourses, 4.85);
console.log("Top Rated Courses:", topRated);
`,
  },
  "py-async": {
    label: "Python AsyncIO & Coroutines",
    lang: "python",
    code: `# K-Tech Python Async Playground
import asyncio

async def fetch_course_data(course_id: int):
    print(f"Fetching course #{course_id}...")
    await asyncio.sleep(0.5)
    return {"id": course_id, "title": f"Course-{course_id}", "status": "active"}

async def main():
    print("Starting concurrent fetches...")
    results = await asyncio.gather(
        fetch_course_data(101),
        fetch_course_data(102),
        fetch_course_data(103)
    )
    print("Fetched all courses:", results)

# Simulated execution output
print("Simulating Python AsyncIO execution...")
print("Output: [Course 101, Course 102, Course 103] fetched successfully in 0.5s.")
`,
  },
  "sql-queries": {
    label: "SQL Window Functions & Analytics",
    lang: "sql",
    code: `-- K-Tech SQL Playground: Window Functions
SELECT 
    student_id,
    course_name,
    score,
    RANK() OVER (PARTITION BY course_name ORDER BY score DESC) as rank_in_course,
    AVG(score) OVER (PARTITION BY course_name) as course_avg_score
FROM student_exam_results
WHERE completed_at >= '2026-01-01'
ORDER BY course_name, score DESC;
`,
  },
  "html-preview": {
    label: "HTML & CSS Cyber Card",
    lang: "html",
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #090d16;
      color: #00f0ff;
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid #14b8a6;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 0 20px rgba(20, 184, 166, 0.3);
      text-align: center;
    }
    h1 { margin: 0 0 8px 0; color: #fff; }
    p { color: #94a3b8; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 K-Tech Playground</h1>
    <p>Live HTML/CSS rendering environment</p>
  </div>
</body>
</html>`,
  }
};

export default function PlaygroundPage() {
  const [selectedSnippetKey, setSelectedSnippetKey] = useState<string>("ts-generics");
  const [code, setCode] = useState<string>(SNIPPETS["ts-generics"].code);
  const [language, setLanguage] = useState<string>("typescript");
  const [outputLogs, setOutputLogs] = useState<string[]>([
    "ยินดีต้อนรับสู่ K-Tech Playground!",
    "พิมพ์โค้ดหรือเลือกตัวอย่าง Snippets ด้านบน แล้วกดปุ่ม 'รันโค้ด' เพื่อดูผลลัพธ์",
  ]);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");

  const handleSelectSnippet = (key: string) => {
    setSelectedSnippetKey(key);
    const snippet = SNIPPETS[key];
    if (snippet) {
      setCode(snippet.code);
      setLanguage(snippet.lang);
      if (snippet.lang === "html") {
        setActiveTab("preview");
      } else {
        setActiveTab("code");
      }
      setOutputLogs([`Loaded template: ${snippet.label}`]);
    }
  };

  const handleRunCode = () => {
    const logs: string[] = [];
    const fakeConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)).join(" "));
      },
      error: (...args: any[]) => {
        logs.push(`[ERROR] ${args.join(" ")}`);
      },
      warn: (...args: any[]) => {
        logs.push(`[WARN] ${args.join(" ")}`);
      },
    };

    try {
      if (language === "javascript" || language === "typescript") {
        const runFn = new Function("console", code);
        const result = runFn(fakeConsole);
        if (result !== undefined && logs.length === 0) {
          logs.push(String(result));
        }
      } else if (language === "python") {
        const lines = code.split("\n");
        let printed = false;
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("print(") && trimmed.endsWith(")")) {
            const inner = trimmed.substring(6, trimmed.length - 1);
            try {
              // eslint-disable-next-line no-eval
              logs.push(String(eval(inner)));
            } catch {
              logs.push(inner.replace(/['"]/g, ""));
            }
            printed = true;
          }
        }
        if (!printed) {
          logs.push("Python Executed: Status 0 (No stdout)");
        }
      } else if (language === "sql") {
        logs.push("+------------+----------------------+-------+---------------+");
        logs.push("| student_id | course_name          | score | rank_in_course|");
        logs.push("+------------+----------------------+-------+---------------+");
        logs.push("| KT-901     | Svelte 5 Runes       | 98.5  | 1             |");
        logs.push("| KT-882     | NestJS Architecture  | 95.0  | 1             |");
        logs.push("| KT-710     | Kafka Event Streams  | 92.0  | 1             |");
        logs.push("+------------+----------------------+-------+---------------+");
        logs.push("(3 rows in set - Simulated PostgreSQL Query Output)");
      } else if (language === "html") {
        logs.push("HTML rendered in Live Preview Tab.");
      }

      if (logs.length === 0) {
        logs.push("Execution finished successfully with return code 0.");
      }
      setOutputLogs(logs);
    } catch (err: any) {
      setOutputLogs([`Runtime Error: ${err.message}`]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Header bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>K-Tech Multi-Language Sandbox</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase font-mono">
                {language}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              ทดลองเขียนโค้ด TypeScript, Python, SQL, HTML ได้แบบ Interactive
            </p>
          </div>
        </div>

        {/* Snippet Picker & Language Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">เทมเพลต:</span>
            <select
              value={selectedSnippetKey}
              onChange={(e) => handleSelectSnippet(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            >
              {Object.entries(SNIPPETS).map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            {language === "html" && (
              <button
                onClick={() => setActiveTab(activeTab === "code" ? "preview" : "code")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  activeTab === "preview"
                    ? "bg-purple-950 text-purple-300 border-purple-700"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                <Layout className="w-3.5 h-3.5 inline mr-1" />
                Live Preview
              </button>
            )}

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 inline text-emerald-400 mr-1" /> : <Copy className="w-3.5 h-3.5 inline mr-1" />}
              {copied ? "คัดลอกแล้ว" : "คัดลอก"}
            </button>

            <button
              onClick={handleRunCode}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>รันโค้ด (Run)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace: Editor and Console */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Pane */}
        <div className="w-full lg:w-3/5 h-1/2 lg:h-auto border-r border-slate-800 relative bg-slate-950">
          {activeTab === "preview" ? (
            <iframe
              srcDoc={code}
              title="Sandbox HTML Preview"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts"
            />
          ) : (
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize: 14,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: true },
                automaticLayout: true,
                tabSize: 2,
                lineNumbers: "on",
                padding: { top: 16, bottom: 16 },
              }}
            />
          )}
        </div>

        {/* Console / Output Pane */}
        <div className="w-full lg:w-2/5 h-1/2 lg:h-auto bg-slate-950 flex flex-col border-t lg:border-t-0 border-slate-800">
          <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-semibold text-slate-200">Execution Output</span>
            </div>
            <button
              onClick={() => setOutputLogs([])}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              ล้างหน้าจอ
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs custom-scrollbar space-y-2">
            {outputLogs.map((log, idx) => (
              <div
                key={idx}
                className={`leading-relaxed whitespace-pre-wrap ${
                  log.includes("Error") || log.includes("[ERROR]")
                    ? "text-rose-400"
                    : "text-slate-300"
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
