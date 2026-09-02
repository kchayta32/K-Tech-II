"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  BarChart3,
  Network,
  RefreshCw,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ChartMode = "bar" | "network";

interface DataItem {
  label: string;
  value: number;
  category: string;
  color?: string;
}

interface NetworkNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  group: number;
  role: string;
  size: number;
}

interface NetworkLink extends d3.SimulationLinkDatum<NetworkNode> {
  source: string | NetworkNode;
  target: string | NetworkNode;
  value: number;
}

const DEFAULT_BAR_DATA: DataItem[] = [
  { label: "React / Next.js", value: 92, category: "Frontend", color: "#00f0ff" },
  { label: "Node.js / Express", value: 85, category: "Backend", color: "#14b8a6" },
  { label: "Python (FastAPI)", value: 88, category: "AI / Backend", color: "#a855f7" },
  { label: "PostgreSQL", value: 78, category: "Database", color: "#3b82f6" },
  { label: "Docker & K8s", value: 81, category: "DevOps", color: "#ec4899" },
  { label: "Kafka / Redis", value: 74, category: "Streaming", color: "#f59e0b" },
];

const INITIAL_NODES: NetworkNode[] = [
  { id: "gateway", name: "API Gateway (Kong/Nginx)", group: 1, role: "Gateway", size: 28 },
  { id: "auth", name: "Auth Microservice", group: 2, role: "Backend", size: 22 },
  { id: "courses", name: "Course Service", group: 2, role: "Backend", size: 22 },
  { id: "compiler", name: "Code Runner Engine", group: 2, role: "Compute", size: 24 },
  { id: "kafka", name: "Kafka Broker", group: 3, role: "Event Bus", size: 26 },
  { id: "db_pg", name: "PostgreSQL Cluster", group: 4, role: "Database", size: 25 },
  { id: "cache_redis", name: "Redis Cache Layer", group: 4, role: "Cache", size: 20 },
  { id: "client_web", name: "Web App (Next.js)", group: 1, role: "Frontend", size: 24 },
];

const INITIAL_LINKS: NetworkLink[] = [
  { source: "client_web", target: "gateway", value: 5 },
  { source: "gateway", target: "auth", value: 3 },
  { source: "gateway", target: "courses", value: 4 },
  { source: "gateway", target: "compiler", value: 4 },
  { source: "auth", target: "cache_redis", value: 2 },
  { source: "auth", target: "db_pg", value: 3 },
  { source: "courses", target: "db_pg", value: 3 },
  { source: "courses", target: "cache_redis", value: 2 },
  { source: "compiler", target: "kafka", value: 4 },
  { source: "courses", target: "kafka", value: 2 },
];

export function D3ChartVisualizer() {
  const [mode, setMode] = useState<ChartMode>("network");
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Bar chart state
  const [barData, setBarData] = useState<DataItem[]>(DEFAULT_BAR_DATA);
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");

  // Force simulation parameters
  const [linkDistance, setLinkDistance] = useState<number>(100);
  const [chargeStrength, setChargeStrength] = useState<number>(-280);
  const [collisionRadius, setCollisionRadius] = useState<number>(35);
  const [activeNode, setActiveNode] = useState<NetworkNode | null>(null);

  // 1. Render Bar Chart
  useEffect(() => {
    if (mode !== "bar" || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 640;
    const height = 360;
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    let data = [...barData];
    if (sortOrder === "asc") data.sort((a, b) => a.value - b.value);
    if (sortOrder === "desc") data.sort((a, b) => b.value - a.value);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Gridlines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat(() => "")
      )
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g.selectAll(".tick line").attr("stroke", "#334155").attr("stroke-opacity", 0.4)
      );

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call((g) => g.select(".domain").attr("stroke", "#475569"))
      .call((g) =>
        g
          .selectAll("text")
          .attr("fill", "#94a3b8")
          .attr("transform", "rotate(-15)")
          .style("text-anchor", "end")
          .style("font-size", "11px")
          .style("font-family", "inherit")
      );

    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d}%`))
      .call((g) => g.select(".domain").attr("stroke", "#475569"))
      .call((g) =>
        g
          .selectAll("text")
          .attr("fill", "#94a3b8")
          .style("font-size", "11px")
          .style("font-family", "inherit")
      );

    // Bars
    const bars = svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.label) || 0)
      .attr("width", x.bandwidth())
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("rx", 6)
      .attr("fill", (d) => d.color || "#00f0ff")
      .attr("opacity", 0.9)
      .style("cursor", "pointer");

    bars
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => y(0) - y(d.value));

    // Value Labels on Bars
    svg
      .append("g")
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "#f8fafc")
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .attr("opacity", 0)
      .text((d) => `${d.value}%`)
      .transition()
      .delay(400)
      .duration(500)
      .attr("opacity", 1);
  }, [mode, barData, sortOrder]);

  // 2. Render Force Network Graph
  useEffect(() => {
    if (mode !== "network" || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 640;
    const height = 360;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const nodes: NetworkNode[] = INITIAL_NODES.map((d) => ({ ...d }));
    const links: NetworkLink[] = INITIAL_LINKS.map((d) => ({ ...d }));

    const colorScale = d3
      .scaleOrdinal<number, string>()
      .domain([1, 2, 3, 4])
      .range(["#00f0ff", "#14b8a6", "#a855f7", "#3b82f6"]);

    // Defs for Glow Filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "glow");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "3.5")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Background Grid
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("click", () => setActiveNode(null));

    const g = svg.append("g");

    // Force Simulation
    const simulation = d3
      .forceSimulation<NetworkNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<NetworkNode, NetworkLink>(links)
          .id((d) => d.id)
          .distance(linkDistance)
      )
      .force("charge", d3.forceManyBody().strength(chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(collisionRadius));

    // Render Links
    const link = g
      .append("g")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 1.8);

    // Render Nodes Group
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "grab")
      .call(
        d3
          .drag<SVGGElement, NetworkNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node outer circle (glow)
    node
      .append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => colorScale(d.group))
      .attr("fill-opacity", 0.2)
      .attr("stroke", (d) => colorScale(d.group))
      .attr("stroke-width", 2)
      .attr("filter", "url(#glow)");

    // Node inner core
    node
      .append("circle")
      .attr("r", (d) => d.size * 0.5)
      .attr("fill", (d) => colorScale(d.group));

    // Node Labels
    node
      .append("text")
      .text((d) => d.name)
      .attr("x", 0)
      .attr("y", (d) => d.size + 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#cbd5e1")
      .attr("font-size", "10px")
      .attr("font-family", "inherit")
      .attr("pointer-events", "none");

    // Click handler for node inspection
    node.on("click", (event, d) => {
      event.stopPropagation();
      setActiveNode(d);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as NetworkNode).x || 0)
        .attr("y1", (d) => (d.source as NetworkNode).y || 0)
        .attr("x2", (d) => (d.target as NetworkNode).x || 0)
        .attr("y2", (d) => (d.target as NetworkNode).y || 0);

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [mode, linkDistance, chargeStrength, collisionRadius]);

  const randomizeValues = () => {
    setBarData((prev) =>
      prev.map((d) => ({
        ...d,
        value: Math.floor(Math.random() * 60) + 40,
      }))
    );
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-950/90 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              D3.js Data Visualizer Sandbox
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                Interactive SVG
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {mode === "network"
                ? "Microservices Topology & Force Physics Simulation (ลาก Node เพื่อทดสอบ)"
                : "Tech Stack Popularity Distribution (Animated Bar Chart)"}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setMode("network")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              mode === "network"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Network Graph</span>
          </button>
          <button
            onClick={() => setMode("bar")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
              mode === "bar"
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Bar Chart</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer SVG Stage */}
      <div className="relative w-full aspect-[16/9] max-h-[380px] bg-slate-950 flex items-center justify-center p-2">
        <svg
          ref={svgRef}
          className="w-full h-full select-none"
          style={{ overflow: "visible" }}
        />

        {/* Selected Node Details Popup */}
        {mode === "network" && activeNode && (
          <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-slate-900/90 border border-cyan-500/40 shadow-xl backdrop-blur-md max-w-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-cyan-300 font-mono">
                {activeNode.id}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {activeNode.role}
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">{activeNode.name}</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Status: <span className="text-emerald-400">● 100% Operational</span>
            </p>
          </div>
        )}
      </div>

      {/* Control Panel Footer */}
      <div className="px-4 py-3 border-t border-slate-800/80 bg-slate-900/40 flex flex-wrap items-center justify-between gap-4 text-xs">
        {mode === "network" ? (
          <div className="flex flex-wrap items-center gap-4 w-full justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Distance Slider */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Link Distance:</span>
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={linkDistance}
                  onChange={(e) => setLinkDistance(Number(e.target.value))}
                  className="w-24 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-cyan-400 font-mono">{linkDistance}px</span>
              </div>

              {/* Charge Strength Slider */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Repulsion:</span>
                <input
                  type="range"
                  min="-500"
                  max="-100"
                  value={chargeStrength}
                  onChange={(e) => setChargeStrength(Number(e.target.value))}
                  className="w-24 accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-purple-400 font-mono">{chargeStrength}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setLinkDistance(100);
                setChargeStrength(-280);
              }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ตพารามิเตอร์</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">เรียงลำดับข้อมูล:</span>
              <button
                onClick={() => setSortOrder("none")}
                className={cn(
                  "px-2 py-1 rounded text-xs",
                  sortOrder === "none" ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "text-slate-400"
                )}
              >
                ดั้งเดิม
              </button>
              <button
                onClick={() => setSortOrder("desc")}
                className={cn(
                  "px-2 py-1 rounded text-xs",
                  sortOrder === "desc" ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "text-slate-400"
                )}
              >
                มาก ➜ น้อย
              </button>
              <button
                onClick={() => setSortOrder("asc")}
                className={cn(
                  "px-2 py-1 rounded text-xs",
                  sortOrder === "asc" ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "text-slate-400"
                )}
              >
                น้อย ➜ มาก
              </button>
            </div>

            <button
              onClick={randomizeValues}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition-all font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>สุ่มค่าใหม่ (Randomize Data)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
