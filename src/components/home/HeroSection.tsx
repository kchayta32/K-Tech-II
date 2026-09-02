"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Compass,
  Terminal,
  Code2,
  CheckCircle2,
  Play,
  Copy,
  Check,
  Cpu,
  Flame,
  Zap,
  Layers,
  BookOpen,
  Award,
} from "lucide-react";

interface CodeSnippet {
  id: string;
  name: string;
  lang: string;
  code: string;
  output: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: "svelte5",
    name: "Svelte 5 Runes",
    lang: "svelte",
    code: `<script lang="ts">
  // Modern Reactive State in Svelte 5
  let count = $state(0);
  let double = $derived(count * 2);

  $effect(() => {
    console.log(\`Counter changed to: \${count}\`);
  });
</script>

<button onclick={() => count++}>
  Clicked {count} times (Double: {double})
</button>`,
    output: `⚡ Compiled in 1.4ms
[Svelte 5 Runtime] State initialized: count = 0
[Derived Signal] double = 0
> Button clicked: count = 1, double = 2
> Button clicked: count = 2, double = 4
✓ Zero Virtual DOM Overhead`,
  },
  {
    id: "typescript",
    name: "TypeScript AST",
    lang: "typescript",
    code: `// Type-Level Pattern Matching with Generics
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

type ExtractRouteParams<T extends string> =
  T extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? Param | ExtractRouteParams<\`/\${Rest}\`>
    : T extends \`\${string}:\${infer Param}\`
    ? Param
    : never;

type Params = ExtractRouteParams<"/courses/:courseId/lessons/:lessonId">;
// Result: "courseId" | "lessonId"`,
    output: `✓ TypeScript 5.6 Typecheck passed in 8ms
Type Params = "courseId" | "lessonId"
Type-safety index: 100% Guaranteed`,
  },
  {
    id: "ai-agent",
    name: "LangGraph Agent",
    lang: "python",
    code: `from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

# Autonomous Multi-Agent Decision Loop
def research_node(state):
    query = state["question"]
    docs = vector_store.similarity_search(query, k=3)
    return {"context": docs}

def synthesize_node(state):
    answer = llm.invoke(prompt.format(ctx=state["context"]))
    return {"answer": answer}

workflow = StateGraph(AgentState)
workflow.add_node("research", research_node)
workflow.add_node("synthesize", synthesize_node)
workflow.set_entry_point("research")
workflow.add_edge("research", "synthesize")
app = workflow.compile()`,
    output: `[LangGraph] Graph compiled successfully.
[Agent: research] Retrieved 3 high-relevance chunks from VectorDB
[Agent: synthesize] Generated verified code response
✓ Hallucination check score: 0.99 (Verified)`,
  },
  {
    id: "go-grpc",
    name: "Go Concurrency",
    lang: "go",
    code: `package main

import "sync"

// High-Throughput Worker Pool with Sub-ms Latency
func processEvents(stream <-chan Event, wg *sync.WaitGroup) {
    defer wg.Done()
    for ev := range stream {
        go func(e Event) {
            latency := dispatchToEngine(e)
            metrics.ObserveLatency(latency)
        }(ev)
    }
}`,
    output: `[Go Runtime] 10,000 Goroutines spawned
Throughput: 450,000 req/sec
p99 Latency: 0.42ms
Memory Allocated: 14.2 MB`,
  },
];

const TECH_BADGES = [
  { name: "Svelte 5", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
  { name: "Next.js 14", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  { name: "TypeScript 5", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { name: "D3.js Data Viz", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  { name: "NestJS & CQRS", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
  { name: "Go & gRPC", color: "bg-teal-500/10 text-teal-400 border-teal-500/30" },
  { name: "Apache Kafka", color: "bg-red-500/10 text-red-400 border-red-500/30" },
  { name: "Redis Streams", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
  { name: "LLM Agents & RAG", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  { name: "Docker & K8s", color: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
];

export default function HeroSection() {
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const activeSnippet = SNIPPETS[activeSnippetIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsRunning(true);
    setShowOutput(false);
    setTimeout(() => {
      setIsRunning(false);
      setShowOutput(true);
    }, 600);
  };

  return (
    <section className="relative w-full pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-cyber-grid">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            {/* Cyber Platform Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-indigo-500/10 border border-teal-500/30 backdrop-blur-md shadow-lg shadow-teal-500/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-semibold text-cyan-300 font-mono tracking-wide">
                K-TECH OPEN MOOC 2.0 • 100% FREE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              ก้าวสู่วิศวกรซอฟต์แวร์{" "}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                ระดับไฮเอนด์
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              แพลตฟอร์ม MOOC การเรียนรู้เชิงลึกด้าน Frontend, Backend, Event Streaming, AI Agents, และ Cloud-Native พร้อม Interactive Code Runner ในเบราว์เซอร์ และใบประกาศนียบัตรดิจิทัล
            </p>

            {/* Glowing Tech Badges Marquee-like pills */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1">
              {TECH_BADGES.map((b) => (
                <span
                  key={b.name}
                  className={`text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg border backdrop-blur-md transition-all hover:scale-105 ${b.color}`}
                >
                  {b.name}
                </span>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-3">
              <Link
                href="/courses"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 hover:from-teal-300 hover:to-indigo-300 shadow-lg shadow-teal-500/25 hover:shadow-cyan-400/40 transition-all duration-300 group"
              >
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>สำรวจ 19+ หลักสูตร</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/roadmaps"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>ดูแผนผังการเรียน (Roadmaps)</span>
              </Link>

              <Link
                href="/playground"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-900 border border-slate-800 transition-all"
              >
                <Terminal className="w-3.5 h-3.5 text-teal-400" />
                <span>Playground</span>
              </Link>
            </div>

            {/* Trust Metrics / Stats Counter */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black font-mono text-cyan-400">
                  19+
                </p>
                <p className="text-xs text-slate-400">Master Courses</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black font-mono text-teal-400">
                  120+
                </p>
                <p className="text-xs text-slate-400">Interactive Labs</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black font-mono text-indigo-400">
                  100%
                </p>
                <p className="text-xs text-slate-400">Free & Open Source</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Code Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="relative rounded-2xl bg-slate-950/90 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-2xl ring-1 ring-white/10 glow-cyan">
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 text-xs font-mono text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    k-tech-runner
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="คัดลอกโค้ด"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRun}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Play
                      className={`w-3 h-3 fill-teal-300 ${
                        isRunning ? "animate-spin" : ""
                      }`}
                    />
                    <span>{isRunning ? "รันโค้ด..." : "Execute"}</span>
                  </button>
                </div>
              </div>

              {/* Code Snippet Tabs */}
              <div className="flex items-center gap-1 px-3 py-2 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto text-xs no-scrollbar">
                {SNIPPETS.map((snip, index) => (
                  <button
                    key={snip.id}
                    onClick={() => {
                      setActiveSnippetIndex(index);
                      setShowOutput(false);
                    }}
                    className={`px-3 py-1 rounded-lg font-mono text-xs whitespace-nowrap transition-all ${
                      activeSnippetIndex === index
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {snip.name}
                  </button>
                ))}
              </div>

              {/* Code Editor Body */}
              <div className="p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto text-slate-200 min-h-[260px] max-h-[360px]">
                <pre className="text-left font-mono">
                  <code>{activeSnippet.code}</code>
                </pre>
              </div>

              {/* Live Terminal Output Drawer */}
              {(showOutput || isRunning) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-slate-900/95 border-t border-slate-800 p-3 font-mono text-xs text-slate-300"
                >
                  <div className="flex items-center gap-2 text-[11px] text-teal-400 font-semibold mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    <span>OUTPUT CONSOLE</span>
                  </div>
                  {isRunning ? (
                    <p className="text-slate-400 animate-pulse">
                      Executing sandbox environment...
                    </p>
                  ) : (
                    <pre className="text-teal-300/90 whitespace-pre-wrap leading-relaxed">
                      {activeSnippet.output}
                    </pre>
                  )}
                </motion.div>
              )}

              {/* Bottom Quick Feature Strip */}
              <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Monaco Code Runner & Test Suites</span>
                </div>
                <Link
                  href="/playground"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>เปิดแล็บเต็มจอ</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
