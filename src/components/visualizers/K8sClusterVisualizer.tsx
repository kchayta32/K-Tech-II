"use client";

import React, { useState, useEffect } from "react";
import {
  Server,
  Cpu,
  HardDrive,
  Box,
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  Send,
  Zap,
  ShieldCheck,
  Activity,
  Globe,
  Radio,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PodStatus = "Running" | "Pending" | "CrashLoopBackOff" | "Terminating";

interface K8sPod {
  id: string;
  name: string;
  nodeId: string;
  status: PodStatus;
  restarts: number;
  cpu: number;
  memory: string;
  ip: string;
}

interface K8sNode {
  id: string;
  name: string;
  role: "control-plane" | "worker";
  status: "Ready" | "NotReady" | "Cordoned";
  cpuUsage: number; // %
  memUsage: number; // %
  maxPods: number;
}

const INITIAL_NODES: K8sNode[] = [
  { id: "node-1", name: "worker-node-01", role: "worker", status: "Ready", cpuUsage: 35, memUsage: 45, maxPods: 4 },
  { id: "node-2", name: "worker-node-02", role: "worker", status: "Ready", cpuUsage: 40, memUsage: 50, maxPods: 4 },
  { id: "node-3", name: "worker-node-03", role: "worker", status: "Ready", cpuUsage: 25, memUsage: 30, maxPods: 4 },
];

export function K8sClusterVisualizer() {
  const [nodes, setNodes] = useState<K8sNode[]>(INITIAL_NODES);
  const [desiredReplicas, setDesiredReplicas] = useState(4);
  const [pods, setPods] = useState<K8sPod[]>([
    { id: "pod-1", name: "api-v1-84fb-9x1", nodeId: "node-1", status: "Running", restarts: 0, cpu: 12, memory: "128Mi", ip: "10.244.1.12" },
    { id: "pod-2", name: "api-v1-84fb-9x2", nodeId: "node-1", status: "Running", restarts: 0, cpu: 14, memory: "132Mi", ip: "10.244.1.13" },
    { id: "pod-3", name: "api-v1-84fb-9x3", nodeId: "node-2", status: "Running", restarts: 0, cpu: 11, memory: "120Mi", ip: "10.244.2.08" },
    { id: "pod-4", name: "api-v1-84fb-9x4", nodeId: "node-3", status: "Running", restarts: 0, cpu: 15, memory: "140Mi", ip: "10.244.3.19" },
  ]);

  const [activeTraffic, setActiveTraffic] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    "[17:40:00] [k8s-scheduler] Successfully assigned api-v1-84fb-9x1 to worker-node-01",
    "[17:40:02] [kubelet] Started container 'api-server' on node-1",
    "[17:40:10] [ingress-nginx] Routed 1.2k req/s across 4 endpoints",
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString("th-TH");
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 15)]);
  };

  // Reconcile Replicas to match desired count
  const handleScale = (newCount: number) => {
    if (newCount < 1 || newCount > 8) return;
    setDesiredReplicas(newCount);

    if (newCount > pods.length) {
      // Scale UP
      const availableNodes = nodes.filter((n) => n.status === "Ready");
      if (availableNodes.length === 0) return;

      const targetNode = availableNodes[Math.floor(Math.random() * availableNodes.length)];
      const newPodId = `pod-${Date.now().toString(36)}`;
      const randomSuffix = Math.random().toString(36).substring(2, 5);

      const newPod: K8sPod = {
        id: newPodId,
        name: `api-v1-84fb-${randomSuffix}`,
        nodeId: targetNode.id,
        status: "Pending",
        restarts: 0,
        cpu: 10,
        memory: "120Mi",
        ip: `10.244.${targetNode.id.slice(-1)}.${Math.floor(Math.random() * 80) + 10}`,
      };

      setPods((prev) => [...prev, newPod]);
      addLog(`[deployment/api-v1] Scaling up -> Created pod ${newPod.name} on ${targetNode.name}`);

      setTimeout(() => {
        setPods((prev) =>
          prev.map((p) => (p.id === newPodId ? { ...p, status: "Running" } : p))
        );
        addLog(`[kubelet] Pod ${newPod.name} is now Running (Healthy)`);
      }, 900);
    } else if (newCount < pods.length) {
      // Scale DOWN
      const podToRemove = pods[pods.length - 1];
      setPods((prev) =>
        prev.map((p) => (p.id === podToRemove.id ? { ...p, status: "Terminating" } : p))
      );
      addLog(`[deployment/api-v1] Scaling down -> Terminating pod ${podToRemove.name}`);

      setTimeout(() => {
        setPods((prev) => prev.filter((p) => p.id !== podToRemove.id));
        addLog(`[kubelet] Pod ${podToRemove.name} gracefully removed`);
      }, 800);
    }
  };

  // Chaos: Crash a pod
  const triggerChaosCrash = (podId: string) => {
    const pod = pods.find((p) => p.id === podId);
    if (!pod) return;

    setPods((prev) =>
      prev.map((p) =>
        p.id === podId
          ? { ...p, status: "CrashLoopBackOff", restarts: p.restarts + 1 }
          : p
      )
    );
    addLog(`⚠️ [OOMKilled/Chaos] Pod ${pod.name} crashed with ExitCode 137`);

    // Self-healing by ReplicaSet controller
    setTimeout(() => {
      setPods((prev) =>
        prev.map((p) =>
          p.id === podId ? { ...p, status: "Running" } : p
        )
      );
      addLog(`✅ [kubelet] Self-healed: Pod ${pod.name} restarted and healthy`);
    }, 2000);
  };

  // Ingress HTTP Request simulation
  const sendRequest = () => {
    const runningPods = pods.filter((p) => p.status === "Running");
    if (runningPods.length === 0) return;

    const targetPod = runningPods[Math.floor(Math.random() * runningPods.length)];
    setActiveTraffic(targetPod.id);
    addLog(`[ingress-nginx] GET /api/v1/lessons ➜ Forwarded to Pod ${targetPod.name} (${targetPod.ip}:8080) [200 OK]`);

    setTimeout(() => {
      setActiveTraffic(null);
    }, 800);
  };

  // Cordon / Drain node
  const toggleCordonNode = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const newStatus = n.status === "Cordoned" ? "Ready" : "Cordoned";
          addLog(`[kubectl] Node ${n.name} marked as ${newStatus}`);
          return { ...n, status: newStatus };
        }
        return n;
      })
    );

    // Evacuate pods if cordoned
    const node = nodes.find((n) => n.id === nodeId);
    if (node && node.status !== "Cordoned") {
      const remainingNodes = nodes.filter((n) => n.id !== nodeId && n.status === "Ready");
      if (remainingNodes.length > 0) {
        setPods((prev) =>
          prev.map((p) => {
            if (p.nodeId === nodeId) {
              const target = remainingNodes[Math.floor(Math.random() * remainingNodes.length)];
              addLog(`[k8s-scheduler] Evacuating pod ${p.name} -> Migrated to ${target.name}`);
              return { ...p, nodeId: target.id };
            }
            return p;
          })
        );
      }
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">
                Kubernetes (K8s) Cluster Architecture Sandbox
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                v1.30.2-ktech
              </span>
            </div>
            <p className="text-xs text-slate-400">
              จำลอง Control Plane, Pod Scaling, Ingress Load Balancing & Self-Healing (คลิก Pod เพื่อจำลอง Crash)
            </p>
          </div>
        </div>

        {/* Replica Scale Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Replicas:</span>
            <button
              onClick={() => handleScale(desiredReplicas - 1)}
              disabled={desiredReplicas <= 1}
              className="w-5 h-5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold"
            >
              -
            </button>
            <span className="text-cyan-400 font-mono font-bold px-1">{desiredReplicas}</span>
            <button
              onClick={() => handleScale(desiredReplicas + 1)}
              disabled={desiredReplicas >= 8}
              className="w-5 h-5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>

          <button
            onClick={sendRequest}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30 text-xs font-semibold transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ยิง HTTP Request</span>
          </button>
        </div>
      </div>

      {/* Cluster Canvas */}
      <div className="p-4 space-y-4">
        {/* 1. Ingress & Control Plane Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Ingress Gateway */}
          <div className="md:col-span-4 p-3 rounded-xl border border-cyan-900/40 bg-slate-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 block font-mono">
                  Ingress Controller
                </span>
                <span className="text-[10px] text-slate-400">
                  Load Balancer (Round Robin)
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              :80 / :443
            </span>
          </div>

          {/* Master Node / Control Plane */}
          <div className="md:col-span-8 p-3 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200 font-mono">
                Control Plane (Master Node)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {["kube-apiserver", "etcd (HA)", "kube-scheduler", "kube-controller"].map(
                (comp) => (
                  <span
                    key={comp}
                    className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 font-mono flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {comp}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* 2. Worker Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nodes.map((node) => {
            const nodePods = pods.filter((p) => p.nodeId === node.id);
            const isCordoned = node.status === "Cordoned";

            return (
              <div
                key={node.id}
                className={cn(
                  "p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-[220px]",
                  isCordoned
                    ? "border-amber-900/60 bg-amber-950/10 opacity-80"
                    : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                )}
              >
                {/* Node Header */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-slate-200 font-mono">
                        {node.name}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleCordonNode(node.id)}
                      title={isCordoned ? "Uncordon Node" : "Cordon Node (Evacuate)"}
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-mono border transition-colors",
                        isCordoned
                          ? "bg-amber-950 text-amber-300 border-amber-800"
                          : "bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-slate-800"
                      )}
                    >
                      {node.status}
                    </button>
                  </div>

                  {/* Resource Gauges */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-3 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 font-mono">
                    <div>
                      <span>CPU: {node.cpuUsage}%</span>
                      <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-cyan-400"
                          style={{ width: `${node.cpuUsage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span>MEM: {node.memUsage}%</span>
                      <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-purple-400"
                          style={{ width: `${node.memUsage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pods in this node */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      Pods ({nodePods.length}/{node.maxPods}):
                    </span>

                    {nodePods.length === 0 ? (
                      <div className="text-center py-4 text-xs text-slate-600 border border-dashed border-slate-800 rounded-lg">
                        ไม่มี Pod ทำงานใน Node นี้
                      </div>
                    ) : (
                      nodePods.map((pod) => {
                        const isTrafficTarget = activeTraffic === pod.id;

                        return (
                          <div
                            key={pod.id}
                            onClick={() => triggerChaosCrash(pod.id)}
                            title="คลิกเพื่อจำลอง Pod Crash (Self-Healing Test)"
                            className={cn(
                              "p-2 rounded-lg border cursor-pointer transition-all relative overflow-hidden group",
                              isTrafficTarget
                                ? "ring-2 ring-cyan-400 bg-cyan-950/60 border-cyan-400 scale-[1.02]"
                                : pod.status === "Running"
                                ? "bg-slate-950/80 border-slate-800 hover:border-cyan-500/50"
                                : pod.status === "CrashLoopBackOff"
                                ? "bg-rose-950/40 border-rose-800 animate-pulse"
                                : "bg-amber-950/30 border-amber-800"
                            )}
                          >
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-200">
                                <Box className="w-3.5 h-3.5 text-cyan-400" />
                                <span className="truncate max-w-[110px]">
                                  {pod.name}
                                </span>
                              </div>

                              <span
                                className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded font-mono font-bold",
                                  pod.status === "Running"
                                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                    : pod.status === "CrashLoopBackOff"
                                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                                    : "bg-amber-950 text-amber-300 border border-amber-800"
                                )}
                              >
                                {pod.status}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                              <span>IP: {pod.ip}</span>
                              <span>Restarts: {pod.restarts}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Terminal Logs View */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-800 pb-1.5 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kubernetes Cluster Events Log</span>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar text-[11px]">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={cn(
                  "leading-relaxed",
                  log.includes("OOMKilled")
                    ? "text-rose-400"
                    : log.includes("Self-healed")
                    ? "text-emerald-400"
                    : log.includes("Scaling")
                    ? "text-cyan-300"
                    : "text-slate-400"
                )}
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
