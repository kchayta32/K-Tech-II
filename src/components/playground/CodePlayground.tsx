"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Code2,
  Terminal,
  LayoutTemplate,
  Sparkles,
  FileCode,
  Share2,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500 font-mono text-xs">
      กำลังโหลด Monaco Code Playground...
    </div>
  ),
});

type SupportedLang = "javascript" | "typescript" | "python" | "sql" | "html";

interface CodeSnippet {
  id: string;
  title: string;
  lang: SupportedLang;
  code: string;
  description: string;
}

const TEMPLATE_SNIPPETS: CodeSnippet[] = [
  {
    id: "js-async",
    title: "JavaScript: Async / Await & Concurrency",
    lang: "javascript",
    description: "ตัวอย่างการยิง Concurrent API Calls ด้วย Promise.allSettled()",
    code: `// Modern Concurrency in JavaScript
async function fetchUserMetrics(userId) {
  console.log(\`[INFO] Starting fetch for user #\${userId}...\`);
  
  const tasks = [
    new Promise(resolve => setTimeout(() => resolve({ role: "Fullstack Dev", xp: 1250 }), 300)),
    new Promise(resolve => setTimeout(() => resolve({ enrolledCourses: ["Next.js", "Kafka", "Kubernetes"] }), 500)),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Telemetry offline")), 200))
  ];

  const results = await Promise.allSettled(tasks);
  
  results.forEach((res, i) => {
    if (res.status === "fulfilled") {
      console.log(\`✅ Task \${i + 1} Succeeded:\`, JSON.stringify(res.value));
    } else {
      console.log(\`❌ Task \${i + 1} Failed:\`, res.reason.message);
    }
  });

  return { status: "Done", completedAt: new Date().toISOString() };
}

fetchUserMetrics(101).then(res => console.log("Final Return:", res));
`,
  },
  {
    id: "ts-generics",
    title: "TypeScript: Generics & Type Guards",
    lang: "typescript",
    description: "ตัวอย่างการสร้าง Generic Cache Container พร้อม Type Narrowing",
    code: `// Safe In-Memory Generic Store
interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

class ReactiveCache<K extends string, V> {
  private store = new Map<K, CacheItem<V>>();

  set(key: K, value: V, ttlMs: number = 5000): void {
    this.store.set(key, {
      data: value,
      expiresAt: Date.now() + ttlMs,
    });
    console.log(\`[Cache] Set key '\${key}' with TTL \${ttlMs}ms\`);
  }

  get(key: K): V | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      console.log(\`[Cache] Key '\${key}' expired!\`);
      return null;
    }
    return item.data;
  }
}

const userSessionCache = new ReactiveCache<string, { username: string; token: string }>();
userSessionCache.set("user:kitti", { username: "kitti_dev", token: "jwt_eyJhbGci..." });
console.log("Retrieved:", userSessionCache.get("user:kitti"));
`,
  },
  {
    id: "py-algo",
    title: "Python: Data Structures & Math",
    lang: "python",
    description: "ตัวอย่าง Fibonacci Generator และ List Comprehension",
    code: `# Pythonic Fibonacci & Prime Analysis
def fibonacci_series(n):
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

fib_10 = fibonacci_series(10)
print(f"Fibonacci Sequence (10 terms): {fib_10}")

# Filter even numbers
evens = [x for x in fib_10 if x % 2 == 0]
print(f"Even numbers in series: {evens}")
print(f"Sum of evens: {sum(evens)}")
`,
  },
  {
    id: "sql-analytics",
    title: "SQL: Window Functions & Aggregation",
    lang: "sql",
    description: "ตัวอย่างการคำนวณ Ranking และ Running Total",
    code: `-- K-Tech Analytics Query
SELECT 
  c.id,
  c.title,
  c.category,
  c.enrolled_count,
  AVG(r.rating) OVER(PARTITION BY c.category) as avg_category_rating,
  RANK() OVER(PARTITION BY c.category ORDER BY c.enrolled_count DESC) as popularity_rank
FROM courses c
LEFT JOIN reviews r ON c.id = r.course_id
WHERE c.is_published = TRUE
ORDER BY popularity_rank ASC, c.enrolled_count DESC
LIMIT 10;
`,
  },
  {
    id: "html-canvas",
    title: "HTML5 / CSS / Canvas: Neon Particle Wave",
    lang: "html",
    description: "สร้าง Interactive HTML Canvas Particle Animation",
    code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; background: #090d16; overflow: hidden; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #fff; }
    canvas { border: 1px solid #1e293b; border-radius: 12px; box-shadow: 0 0 30px rgba(0,240,255,0.2); }
    .badge { position: absolute; top: 20px; font-size: 14px; background: rgba(15,23,42,0.8); padding: 8px 16px; border-radius: 20px; border: 1px solid #00f0ff; color: #00f0ff; }
  </style>
</head>
<body>
  <div class="badge">✨ K-Tech Interactive Canvas Sandbox</div>
  <canvas id="c" width="450" height="300"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    let t = 0;
    function draw() {
      ctx.fillStyle = 'rgba(9, 13, 22, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for(let x = 20; x < canvas.width; x += 16) {
        const y = canvas.height/2 + Math.sin(x * 0.02 + t) * 50 + Math.cos(t * 1.5) * 20;
        ctx.fillStyle = x % 32 === 0 ? '#00f0ff' : '#14b8a6';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      t += 0.04;
      requestAnimationFrame(draw);
    }
    draw();
  </script>
</body>
</html>
`,
  },
];

export function CodePlayground() {
  const [selectedTemplate, setSelectedTemplate] = useState<CodeSnippet>(TEMPLATE_SNIPPETS[0]);
  const [language, setLanguage] = useState<SupportedLang>(selectedTemplate.lang);
  const [code, setCode] = useState<string>(selectedTemplate.code);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeRightTab, setActiveRightTab] = useState<"console" | "preview">("console");

  const handleSelectSnippet = (snippet: CodeSnippet) => {
    setSelectedTemplate(snippet);
    setLanguage(snippet.lang);
    setCode(snippet.code);
    setLogs([]);
    if (snippet.lang === "html") {
      setActiveRightTab("preview");
    } else {
      setActiveRightTab("console");
    }
  };

  const runCode = () => {
    setIsRunning(true);
    const outputLogs: string[] = [];

    const fakeConsole = {
      log: (...args: any[]) => {
        outputLogs.push(
          args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
            )
            .join(" ")
        );
      },
      error: (...args: any[]) => outputLogs.push(`[ERROR] ${args.join(" ")}`),
      warn: (...args: any[]) => outputLogs.push(`[WARN] ${args.join(" ")}`),
    };

    try {
      if (language === "javascript" || language === "typescript") {
        const fn = new Function("console", code);
        const res = fn(fakeConsole);
        if (res !== undefined && outputLogs.length === 0) {
          outputLogs.push(String(res));
        }
      } else if (language === "python") {
        outputLogs.push("[Python Simulation Engine v3.12]");
        const lines = code.split("\n");
        lines.forEach((l) => {
          const t = l.trim();
          if (t.startsWith("print(")) {
            const inner = t.substring(6, t.length - 1);
            outputLogs.push(inner.replace(/['"]/g, ""));
          }
        });
      } else if (language === "sql") {
        outputLogs.push("+----+------------------------+-------------+----------+");
        outputLogs.push("| id | title                  | category    | rank     |");
        outputLogs.push("+----+------------------------+-------------+----------+");
        outputLogs.push("| 01 | Cloud Native K8s       | DevOps      | 1        |");
        outputLogs.push("| 02 | High Perf Kafka Streams| Backend     | 2        |");
        outputLogs.push("+----+------------------------+-------------+----------+");
        outputLogs.push("(Query executed successfully in 12ms)");
      } else if (language === "html") {
        outputLogs.push("HTML rendered in Live Preview Tab.");
        setActiveRightTab("preview");
      }

      if (outputLogs.length === 0) {
        outputLogs.push("Code executed successfully (Process exited with code 0).");
      }
      setLogs(outputLogs);
    } catch (err: any) {
      setLogs([`Runtime Error: ${err.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extMap: Record<SupportedLang, string> = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      sql: "sql",
      html: "html",
    };
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ktech-playground-${Date.now()}.${extMap[language]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Main Navigation Header */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              K-Tech Multi-Language Code Playground
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono uppercase">
                {language}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              เขียนโค้ด ทดสอบอัลกอริทึม และจำลองผลลัพธ์แบบเรียลไทม์
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>คัดลอก</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด</span>
          </button>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isRunning ? "กำลังรัน..." : "รันโค้ด (Run)"}</span>
          </button>
        </div>
      </div>

      {/* Snippet Template Quick Picker */}
      <div className="px-5 py-2.5 bg-slate-900/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          ตัวอย่างเทมเพลต:
        </span>
        {TEMPLATE_SNIPPETS.map((snippet) => (
          <button
            key={snippet.id}
            onClick={() => handleSelectSnippet(snippet)}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all border",
              selectedTemplate.id === snippet.id
                ? "bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
            )}
          >
            {snippet.title}
          </button>
        ))}
      </div>

      {/* Main Split Body: Editor (Left) & Output / Preview (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Monaco Editor Pane (7 Cols) */}
        <div className="lg:col-span-7 h-full border-r border-slate-800 bg-slate-950 relative flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              main.{language === "python" ? "py" : language === "sql" ? "sql" : language === "html" ? "html" : "ts"}
            </span>
            <span className="text-[11px] text-slate-500">Monaco Editor vs-dark</span>
          </div>

          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                fontSize: 13,
                fontFamily: "JetBrains Mono, monospace",
                minimap: { enabled: true },
                automaticLayout: true,
                tabSize: 2,
                lineNumbers: "on",
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        </div>

        {/* Output Console / Live HTML Preview Pane (5 Cols) */}
        <div className="lg:col-span-5 h-full flex flex-col bg-slate-950">
          {/* Output Header Tabs */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900/70 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveRightTab("console")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors",
                  activeRightTab === "console"
                    ? "bg-slate-800 text-cyan-300 shadow"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Standard Output</span>
              </button>

              <button
                onClick={() => setActiveRightTab("preview")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors",
                  activeRightTab === "preview"
                    ? "bg-purple-950 text-purple-300 border border-purple-800 shadow"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>Live Web Preview</span>
              </button>
            </div>

            <button
              onClick={() => setLogs([])}
              className="text-[11px] text-slate-500 hover:text-slate-300"
            >
              ล้าง Console
            </button>
          </div>

          {/* Pane Content */}
          <div className="flex-1 relative overflow-hidden bg-slate-950">
            {activeRightTab === "preview" ? (
              <iframe
                srcDoc={code}
                title="Live Playground Preview"
                className="w-full h-full border-none bg-white"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="p-4 h-full overflow-y-auto font-mono text-xs custom-scrollbar space-y-1 text-slate-300">
                {logs.length === 0 ? (
                  <div className="text-slate-600 italic">
                    กดปุ่ม "รันโค้ด (Run)" ด้านบนเพื่อเริ่มรันโปรแกรม...
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "leading-relaxed whitespace-pre-wrap",
                        log.includes("Error") || log.includes("[ERROR]")
                          ? "text-rose-400"
                          : log.includes("✅")
                          ? "text-emerald-400"
                          : log.includes("❌")
                          ? "text-rose-300"
                          : "text-slate-300"
                      )}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
