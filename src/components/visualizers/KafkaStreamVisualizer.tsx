"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Layers,
  Send,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Server,
  Activity,
  ArrowRight,
  Database,
  CheckCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KafkaMessage {
  id: string;
  offset: number;
  partition: number;
  key: string;
  payload: string;
  timestamp: string;
  status: "queued" | "consumed";
  color: string;
}

const SAMPLE_PAYLOADS = [
  { key: "user_101", payload: '{"event": "enroll_course", "courseId": "react-adv"}' },
  { key: "order_552", payload: '{"event": "payment_success", "amount": 1490}' },
  { key: "telemetry", payload: '{"cpu": 74, "memory": "4.2GB", "region": "bkk"}' },
  { key: "auth_99", payload: '{"event": "login_sso", "provider": "google"}' },
  { key: "quiz_eval", payload: '{"quizId": "q_44", "score": 100, "passed": true}' },
];

const COLORS = ["#00f0ff", "#14b8a6", "#a855f7", "#ec4899", "#f59e0b", "#3b82f6"];

export function KafkaStreamVisualizer() {
  const [topic, setTopic] = useState("ktech.learning.events");
  const [numPartitions, setNumPartitions] = useState(3);
  const [messages, setMessages] = useState<KafkaMessage[]>([
    {
      id: "msg-1",
      offset: 0,
      partition: 0,
      key: "user_101",
      payload: '{"event": "enroll_course", "courseId": "nextjs"}',
      timestamp: "17:40:01",
      status: "consumed",
      color: "#00f0ff",
    },
    {
      id: "msg-2",
      offset: 0,
      partition: 1,
      key: "order_552",
      payload: '{"event": "payment_success", "amount": 1490}',
      timestamp: "17:40:04",
      status: "consumed",
      color: "#14b8a6",
    },
    {
      id: "msg-3",
      offset: 0,
      partition: 2,
      key: "telemetry",
      payload: '{"cpu": 65, "region": "bkk"}',
      timestamp: "17:40:07",
      status: "consumed",
      color: "#a855f7",
    },
    {
      id: "msg-4",
      offset: 1,
      partition: 0,
      key: "quiz_eval",
      payload: '{"score": 95, "user": "Somchai"}',
      timestamp: "17:40:12",
      status: "consumed",
      color: "#ec4899",
    },
  ]);

  const [inputKey, setInputKey] = useState("user_88");
  const [inputPayload, setInputPayload] = useState('{"action": "submit_code", "status": "pass"}');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamSpeed, setStreamSpeed] = useState(1500);
  const [selectedMessage, setSelectedMessage] = useState<KafkaMessage | null>(null);
  const [activeFlyingMsg, setActiveFlyingMsg] = useState<{
    id: string;
    partition: number;
    color: string;
  } | null>(null);

  // Hash key to partition logic
  const getPartitionForKey = (key: string, partitionsCount: number) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % partitionsCount;
  };

  const publishMessage = (customKey?: string, customPayload?: string) => {
    const k = customKey || inputKey || "default_key";
    const p = customPayload || inputPayload || "{}";
    const partition = getPartitionForKey(k, numPartitions);

    // Find next offset for this partition
    const partitionMsgs = messages.filter((m) => m.partition === partition);
    const nextOffset = partitionMsgs.length;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    const newMsg: KafkaMessage = {
      id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      offset: nextOffset,
      partition,
      key: k,
      payload: p,
      timestamp: new Date().toLocaleTimeString("th-TH"),
      status: "queued",
      color,
    };

    // Trigger visual particle
    setActiveFlyingMsg({ id: newMsg.id, partition, color });
    setTimeout(() => {
      setActiveFlyingMsg(null);
    }, 700);

    setMessages((prev) => [...prev.slice(-30), newMsg]);

    // Simulate consumer processing after 1.2s
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: "consumed" } : m))
      );
    }, 1200);
  };

  // Auto-streaming simulator
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const sample = SAMPLE_PAYLOADS[Math.floor(Math.random() * SAMPLE_PAYLOADS.length)];
      publishMessage(sample.key, sample.payload);
    }, streamSpeed);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed, messages, numPartitions]);

  const resetBroker = () => {
    setMessages([]);
    setIsStreaming(false);
    setSelectedMessage(null);
  };

  // Group messages by partition
  const partitions = Array.from({ length: numPartitions }, (_, i) => ({
    id: i,
    messages: messages.filter((m) => m.partition === i),
  }));

  const totalConsumed = messages.filter((m) => m.status === "consumed").length;
  const consumerLag = messages.filter((m) => m.status === "queued").length;

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">
                Apache Kafka Event Stream Simulator
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-mono">
                Topic: {topic}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              จำลอง Producer ส่ง Message ➜ Partition (Key Hashing) ➜ Consumer Groups
            </p>
          </div>
        </div>

        {/* Stream Play / Pause Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md",
              isStreaming
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
            )}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>หยุดจำลองสตรีม</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>เริ่มส่งสตรีมอัตโนมัติ</span>
              </>
            )}
          </button>

          <button
            onClick={resetBroker}
            title="ล้างข้อมูล Broker"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* 1. Producer Section (Left - 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Event Producers
              </h4>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Message Key (ใช้ Hash กำหนด Partition):
                </label>
                <input
                  type="text"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="เช่น user_123, order_99"
                  className="w-full px-2.5 py-1.5 rounded-md bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  JSON Payload:
                </label>
                <textarea
                  rows={2}
                  value={inputPayload}
                  onChange={(e) => setInputPayload(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md bg-slate-950 border border-slate-700 text-[11px] text-slate-200 focus:outline-none focus:border-cyan-500 font-mono resize-none"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => publishMessage()}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs hover:opacity-95 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Message</span>
          </button>
        </div>

        {/* 2. Kafka Topic & Partitions (Middle - 6 Cols) */}
        <div className="lg:col-span-6 p-3.5 rounded-xl border border-cyan-900/40 bg-slate-900/40 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Kafka Topic (Partitions)
              </h4>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>Partitions:</span>
              <button
                onClick={() => setNumPartitions(Math.max(1, numPartitions - 1))}
                className="w-5 h-5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-cyan-400 font-bold">{numPartitions}</span>
              <button
                onClick={() => setNumPartitions(Math.min(4, numPartitions + 1))}
                className="w-5 h-5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Partitions List */}
          <div className="space-y-2.5">
            {partitions.map((p) => {
              const isTargetOfFly = activeFlyingMsg?.partition === p.id;
              return (
                <div
                  key={p.id}
                  className={cn(
                    "p-2.5 rounded-lg border transition-all relative overflow-hidden",
                    isTargetOfFly
                      ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "border-slate-800 bg-slate-950/70"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      Partition {p.id}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {p.messages.length} messages
                    </span>
                  </div>

                  {/* Message Blocks in Partition Queue */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar min-h-[38px]">
                    {p.messages.length === 0 ? (
                      <span className="text-[11px] text-slate-600 italic px-2">
                        Queue is empty
                      </span>
                    ) : (
                      p.messages.map((msg) => (
                        <button
                          key={msg.id}
                          onClick={() => setSelectedMessage(msg)}
                          title={`Offset: ${msg.offset} | Key: ${msg.key}`}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-mono shrink-0 border transition-transform hover:scale-105 flex items-center gap-1",
                            selectedMessage?.id === msg.id
                              ? "ring-2 ring-cyan-400 border-transparent shadow-[0_0_10px_#22d3ee]"
                              : "border-slate-700"
                          )}
                          style={{
                            backgroundColor: `${msg.color}20`,
                            borderColor: `${msg.color}60`,
                            color: msg.color,
                          }}
                        >
                          <span className="font-bold">#{msg.offset}</span>
                          <span className="text-slate-300 max-w-[60px] truncate">
                            {msg.key}
                          </span>
                          {msg.status === "consumed" ? (
                            <CheckCircle className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Consumer Groups (Right - 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Consumer Groups
              </h4>
            </div>

            <div className="space-y-3">
              {/* Group 1 */}
              <div className="p-2.5 rounded-lg border border-purple-900/50 bg-slate-950/60">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-purple-300 font-mono">
                    analytics-worker-group
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Consuming all partitions with load balancing
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-1.5">
                  <span>Processed:</span>
                  <span className="text-purple-400 font-bold">{totalConsumed} msgs</span>
                </div>
              </div>

              {/* Group 2 */}
              <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/40">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-slate-300 font-mono">
                    notification-service
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    Idle
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Subscribed to user payment events</p>
              </div>
            </div>
          </div>

          {/* Consumer Lag Meter */}
          <div className="mt-4 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-[11px]">Consumer Lag:</span>
              <span
                className={cn(
                  "font-mono font-bold text-xs",
                  consumerLag > 3 ? "text-amber-400" : "text-emerald-400"
                )}
              >
                {consumerLag} msgs pending
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
                style={{ width: `${Math.min(100, consumerLag * 20)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Message Inspector Drawer */}
      {selectedMessage && (
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/80 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200 font-mono">
                Message Inspector: {selectedMessage.id}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                Partition {selectedMessage.partition} | Offset #{selectedMessage.offset}
              </span>
            </div>
            <button
              onClick={() => setSelectedMessage(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ปิดหน้าต่าง ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Routing Key:</span>
              <span className="font-mono text-cyan-300">{selectedMessage.key}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Timestamp:</span>
              <span className="font-mono text-slate-300">{selectedMessage.timestamp}</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 md:col-span-3">
              <span className="text-[10px] text-slate-500 block mb-1">Payload:</span>
              <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                {selectedMessage.payload}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
