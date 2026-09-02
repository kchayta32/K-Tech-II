"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Zap,
  Terminal,
  RefreshCw,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

const QUICK_PROMPTS = [
  "⚡ อธิบาย Svelte 5 Runes ($state, $derived)",
  "🔷 ขอโจทย์ซ้อม TypeScript Generics & Conditional Types",
  "🌀 Kafka vs RabbitMQ ต่างกันอย่างไร?",
  "🤖 แนะนำวิธีเริ่มสร้าง LLM Multi-Agent ด้วย LangGraph",
  "☸️ Dockerfile Multi-stage build ทำงานอย่างไร?",
];

const PREDEFINED_KNOWLEDGE: Record<string, { answer: string; code?: string }> = {
  svelte: {
    answer:
      "Svelte 5 ได้แนะนำระบบ **Runes** ซึ่งเป็นสัญลักษณ์พิเศษที่คอมไพเลอร์ของ Svelte ใช้จัดการ Reactive State โดยตรง:\n\n1. **$state(val)**: สร้าง reactive state แทนที่ตัวแปร `let count = 0` แบบเดิม\n2. **$derived(expr)**: คำนวณค่าจาก state ตัวอื่นอัตโนมัติ (คล้าย computed)\n3. **$effect(() => {})**: ทำงานเมื่อ state ที่เกี่ยวข้องเกิดการเปลี่ยนแปลง\n4. **$props()**: รับ properties จาก component ภายนอกแบบ Type-safe",
    code: `<script lang="ts">
  let count = $state(0);
  let double = $derived(count * 2);

  $effect(() => {
    console.log("Count changed to:", count);
  });
</script>

<button onclick={() => count++}>
  Count: {count} (Double: {double})
</button>`,
  },
  typescript: {
    answer:
      "นี่คือตัวอย่างโจทย์ TypeScript Generics ระดับ Advanced: การสกัด Route Parameters จาก String Path ด้วย Template Literal Types!",
    code: `// โจทย์: สร้าง Type Helper เพื่อดึง Parameter ทั้งหมดจาก URL Path
type ExtractRouteParams<Path extends string> =
  Path extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? Param | ExtractRouteParams<\`/\${Rest}\`>
    : Path extends \`\${string}:\${infer Param}\`
    ? Param
    : never;

// ทดสอบ:
type APIParams = ExtractRouteParams<"/api/v1/users/:userId/posts/:postId">;
// ผลลัพธ์: "userId" | "postId"`,
  },
  kafka: {
    answer:
      "ความแตกต่างระหว่าง **Apache Kafka** และ **RabbitMQ** สรุปเป็นประเด็นสำคัญดังนี้:\n\n• **Architecture**: Kafka เป็น *Distributed Commit Log* เก็บ Event แบบถาวรตาม Retention Period ส่วน RabbitMQ เป็น *Message Broker (AMQP)* ที่ลบข้อความทันทีเมื่อ Consumer ทำ Acknowledged\n• **Throughput**: Kafka รองรับหลายล้านข้อความ/วินาที เหมาะกับ Big Data & Stream Processing ส่วน RabbitMQ เหมาะกับ Complex Routing, Task Queues และ Delayed Messages\n• **Consumer State**: ใน Kafka ตัว Consumer จะเป็นผู้จำ Offset เอง สามารถ Replay ย้อนหลังได้ ส่วน RabbitMQ ฝั่ง Broker เป็นผู้จัดการคิว",
  },
  agent: {
    answer:
      "การเริ่มต้นสร้าง **LLM Multi-Agent** ด้วย LangGraph:\n\n1. **Define State**: กำหนดข้อมูลที่แชร์ระหว่าง Agents (Message list, Search results, Plan)\n2. **Define Nodes**: แต่ละ Node คือ Agent หรือ Tool (เช่น Searcher, Coder, Critic)\n3. **Define Edges & Conditional Routing**: กำหนดเงื่อนไขว่าเมื่อไรควรไปยัง Agent ถัดไป หรือส่งคำตอบให้ผู้ใช้\n4. **Compile & Execute**: คอมไพล์ Graph เพื่อรันอย่างปลอดภัย",
    code: `from langgraph.graph import StateGraph, END

# Define Workflow Nodes
def researcher(state):
    return {"docs": search_tool.run(state["query"])}

def coder(state):
    return {"code": code_llm.invoke(state["docs"])}

workflow = StateGraph(AgentState)
workflow.add_node("researcher", researcher)
workflow.add_node("coder", coder)
workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "coder")
workflow.add_edge("coder", END)
app = workflow.compile()`,
  },
  docker: {
    answer:
      "**Multi-stage Build** ใน Docker คือการแบ่งขั้นตอนการสร้าง Image ออกเป็นหลาย Step เพื่อลดขนาด Image และเพิ่มความปลอดภัย โดยขั้นตอน Build สามารถใช้เครื่องมือขนาดใหญ่ (เช่น Node/Go/Rust compilers) แต่ขั้นตอน Final Image จะคัดลอกเฉพาะ Artifact ที่จำเป็นลงใน Minimal Image (เช่น Alpine หรือ Distroless)",
    code: `# Stage 1: Build binary
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o server .

# Stage 2: Minimal runtime image (Size < 20MB)
FROM gcr.io/distroless/static-debian12
COPY --from=builder /app/server /server
CMD ["/server"]`,
  },
};

export default function AITutorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "bot",
      text: "สวัสดีครับ! ผมคือ **K-Bot** AI Learning Assistant ประจำ K-Tech Academy 🤖\n\nหากคุณมีข้อสงสัยเกี่ยวกับโค้ด, ต้องการคำอธิบายบทเรียน, หรืออยากได้โจทย์ฝึกฝนเพิ่มเติม ถามผมได้ทันทีครับ!",
      timestamp: new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsTyping(true);

    // Smart Match response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let matchedData = PREDEFINED_KNOWLEDGE.svelte;

      if (lower.includes("svelte") || lower.includes("rune")) {
        matchedData = PREDEFINED_KNOWLEDGE.svelte;
      } else if (lower.includes("typescript") || lower.includes("generic") || lower.includes("type")) {
        matchedData = PREDEFINED_KNOWLEDGE.typescript;
      } else if (lower.includes("kafka") || lower.includes("rabbitmq") || lower.includes("stream")) {
        matchedData = PREDEFINED_KNOWLEDGE.kafka;
      } else if (lower.includes("agent") || lower.includes("langchain") || lower.includes("langgraph") || lower.includes("ai")) {
        matchedData = PREDEFINED_KNOWLEDGE.agent;
      } else if (lower.includes("docker") || lower.includes("kubernetes") || lower.includes("k8s") || lower.includes("container")) {
        matchedData = PREDEFINED_KNOWLEDGE.docker;
      } else {
        matchedData = {
          answer: `ขอบคุณสำหรับคำถามครับ! เกี่ยวกับประเด็น **"${text}"**:\n\nในหลักสูตรของ K-Tech เรามีแบบฝึกหัดโต้ตอบเสมือนจริงที่ออกแบบมารองรับโดยเฉพาะ คุณสามารถทดลองเขียนโค้ดและรันผลลัพธ์ผ่าน Monaco Runner ในหน้า Playground หรือเปิดดูโมดูลในหน้าหลักสูตรได้เลยครับ!`,
        };
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: matchedData.answer,
        codeSnippet: matchedData.code,
        timestamp: new Date().toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom Right Corner */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-600 text-slate-950 font-bold shadow-2xl shadow-cyan-500/30 ring-2 ring-white/20 group"
          >
            <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-950 text-cyan-400">
              <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal-400" />
            </span>
            <span className="text-xs sm:text-sm tracking-wide font-mono font-bold text-slate-950">
              K-Bot AI Tutor
            </span>
            <span className="text-[10px] bg-slate-950/80 text-cyan-300 font-mono px-1.5 py-0.5 rounded-full">
              LIVE
            </span>
          </motion.button>
        )}
      </div>

      {/* Interactive AI Chat Window / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-6 right-6 z-50 flex flex-col bg-slate-950 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-500/20 overflow-hidden ring-1 ring-white/10 ${
              isExpanded
                ? "w-[92vw] sm:w-[680px] h-[85vh]"
                : "w-[92vw] sm:w-[420px] h-[580px]"
            }`}
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/95 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
                  <Bot className="w-4 h-4 text-slate-950" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-white">
                      K-Bot AI Tutor
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                      GPT-4o Accelerated
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    ตอบคำถามเทคนิค • อธิบายโค้ด • เฉลยโจทย์
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title={isExpanded ? "ย่อหน้าต่าง" : "ขยายหน้าต่าง"}
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="ปิดแชท"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${
                      isBot ? "justify-start" : "justify-end"
                    }`}
                  >
                    {isBot && (
                      <div className="w-6 h-6 rounded-lg bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300 shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-sm ${
                        isBot
                          ? "bg-slate-900 border border-slate-800 text-slate-200"
                          : "bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-medium"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.text}
                      </p>

                      {/* Code Block if Present */}
                      {msg.codeSnippet && (
                        <div className="mt-2 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 text-slate-400">
                            <span className="text-[10px] text-cyan-400 font-semibold flex items-center gap-1">
                              <Terminal className="w-3 h-3" /> CODE EXAMPLE
                            </span>
                            <button
                              type="button"
                              onClick={() => copyCode(msg.codeSnippet!, msg.id)}
                              className="text-[10px] hover:text-white flex items-center gap-1 transition-colors"
                            >
                              {copiedCodeId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-teal-400" />
                                  <span className="text-teal-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="p-3 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
                            <pre>
                              <code>{msg.codeSnippet}</code>
                            </pre>
                          </div>
                        </div>
                      )}

                      <div
                        className={`text-[9px] font-mono text-right ${
                          isBot ? "text-slate-500" : "text-slate-900/70"
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs pl-8">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-200" />
                  <span className="text-[11px] font-mono text-slate-500">
                    K-Bot กำลังพิมพ์คำตอบ...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Carousel */}
            <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800/80 overflow-x-auto text-xs no-scrollbar flex items-center gap-1.5">
              <span className="text-slate-500 text-[10px] font-mono shrink-0 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" /> ถามเร็ว:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 text-[11px] whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="พิมพ์คำถาม หรือขอคำอธิบายโค้ด..."
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 disabled:opacity-40 transition-all font-semibold active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
