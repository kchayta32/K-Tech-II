"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  TrendingDown,
  Activity,
  Layers,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActivationFn = "relu" | "sigmoid" | "tanh" | "leaky_relu";

export function NeuralNetVisualizer() {
  const [activation, setActivation] = useState<ActivationFn>("sigmoid");
  const [inputX1, setInputX1] = useState<number>(0.8);
  const [inputX2, setInputX2] = useState<number>(-0.4);
  const [bias, setBias] = useState<number>(0.2);
  const [learningRate, setLearningRate] = useState<number>(0.05);

  const [epoch, setEpoch] = useState<number>(120);
  const [loss, setLoss] = useState<number>(0.042);
  const [isTraining, setIsTraining] = useState<boolean>(false);

  // Canvas ref for 2D decision boundary
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Weights between layers
  // Layer 0 (Input 2) -> Layer 1 (Hidden 3)
  const [w01, setW01] = useState<number[][]>([
    [1.4, -0.9, 0.6],
    [-1.2, 1.8, -0.4],
  ]);

  // Layer 1 (Hidden 3) -> Layer 2 (Hidden 3)
  const [w12, setW12] = useState<number[][]>([
    [0.9, -1.1, 0.4],
    [-0.7, 1.3, 0.8],
    [1.2, -0.5, -0.9],
  ]);

  // Layer 2 (Hidden 3) -> Layer 3 (Output 1)
  const [w23, setW23] = useState<number[]>([1.5, -1.7, 0.8]);

  // Activation functions
  const activate = (x: number, fn: ActivationFn): number => {
    switch (fn) {
      case "relu":
        return Math.max(0, x);
      case "leaky_relu":
        return x > 0 ? x : 0.1 * x;
      case "sigmoid":
        return 1 / (1 + Math.exp(-x));
      case "tanh":
        return Math.tanh(x);
    }
  };

  // Forward Pass Calculation
  const calculateForwardPass = (x1: number, x2: number) => {
    // Hidden Layer 1 (3 neurons)
    const h1 = [0, 1, 2].map((j) => {
      const z = x1 * w01[0][j] + x2 * w01[1][j] + bias;
      return activate(z, activation);
    });

    // Hidden Layer 2 (3 neurons)
    const h2 = [0, 1, 2].map((j) => {
      const z =
        h1[0] * w12[0][j] +
        h1[1] * w12[1][j] +
        h1[2] * w12[2][j] +
        bias;
      return activate(z, activation);
    });

    // Output Layer (1 neuron)
    const zOut = h2[0] * w23[0] + h2[1] * w23[1] + h2[2] * w23[2] + bias;
    const output = activate(zOut, "sigmoid"); // Classification probability [0, 1]

    return { h1, h2, output };
  };

  const { h1, h2, output } = calculateForwardPass(inputX1, inputX2);

  // Render 2D Decision Boundary on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // Evaluate grid
    for (let py = 0; py < height; py += 2) {
      for (let px = 0; px < width; px += 2) {
        const normX = (px / width) * 4 - 2; // [-2, 2]
        const normY = -((py / height) * 4 - 2); // [-2, 2]

        const res = calculateForwardPass(normX, normY);
        const prob = res.output; // 0 to 1

        // Color gradient: Class 0 (Purple) to Class 1 (Cyan)
        const r = Math.floor(168 * (1 - prob) + 0 * prob);
        const g = Math.floor(85 * (1 - prob) + 240 * prob);
        const b = Math.floor(247 * (1 - prob) + 255 * prob);

        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            const index = ((py + dy) * width + (px + dx)) * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = 160; // transparency
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw coordinate axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw active input point
    const inputPx = ((inputX1 + 2) / 4) * width;
    const inputPy = ((-inputX2 + 2) / 4) * height;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(inputPx, inputPy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }, [inputX1, inputX2, bias, activation, w01, w12, w23]);

  // Training simulation loop
  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setEpoch((prev) => prev + 5);
      setLoss((prev) => Math.max(0.008, prev * 0.98 + (Math.random() * 0.002 - 0.001)));

      // Subtle weight jitter to simulate gradient descent
      setW01((prev) =>
        prev.map((row) => row.map((w) => w + (Math.random() - 0.5) * 0.04))
      );
      setW12((prev) =>
        prev.map((row) => row.map((w) => w + (Math.random() - 0.5) * 0.04))
      );
      setW23((prev) => prev.map((w) => w + (Math.random() - 0.5) * 0.04));
    }, 200);

    return () => clearInterval(interval);
  }, [isTraining]);

  const resetNetwork = () => {
    setEpoch(0);
    setLoss(0.684);
    setIsTraining(false);
    setInputX1(0.5);
    setInputX2(-0.5);
    setW01([
      [1.0, -1.0, 0.5],
      [-1.0, 1.0, -0.5],
    ]);
    setW12([
      [0.8, -0.8, 0.4],
      [-0.8, 0.8, 0.6],
      [0.5, -0.5, -0.5],
    ]);
    setW23([1.0, -1.0, 0.8]);
  };

  // Visual layout for nodes
  const layersLayout = [
    { name: "Input (X)", count: 2, values: [inputX1, inputX2], labels: ["X₁", "X₂"] },
    { name: "Hidden 1", count: 3, values: h1, labels: ["h₁₁", "h₁₂", "h₁₃"] },
    { name: "Hidden 2", count: 3, values: h2, labels: ["h₂₁", "h₂₂", "h₂₃"] },
    { name: "Output (Ŷ)", count: 1, values: [output], labels: ["P(Class 1)"] },
  ];

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-100">
                Deep Neural Network & Activation Simulator
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                MLP 2-3-3-1
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Forward Pass, Synaptic Weights & 2D Decision Boundary
            </p>
          </div>
        </div>

        {/* Training Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTraining(!isTraining)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md",
              isTraining
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                : "bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30"
            )}
          >
            {isTraining ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>หยุดเทรน</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>เริ่มเทรนโมเดล (Train)</span>
              </>
            )}
          </button>

          <button
            onClick={resetNetwork}
            title="รีเซ็ตโครงข่าย"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: SVG Network Diagram (Left) & Decision Boundary (Right) */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* SVG Network Architecture (8 cols) */}
        <div className="lg:col-span-8 relative aspect-[16/10] bg-slate-900/40 rounded-xl border border-slate-800/80 p-2 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 560 320">
            <defs>
              <linearGradient id="synapseCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="synapsePink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Render Synapse Connections Layer 0 -> 1 */}
            {[0, 1].map((i) =>
              [0, 1, 2].map((j) => {
                const x1 = 70;
                const y1 = i === 0 ? 110 : 210;
                const x2 = 210;
                const y2 = 80 + j * 80;
                const weight = w01[i][j];
                const isPos = weight >= 0;

                return (
                  <line
                    key={`l01-${i}-${j}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isPos ? "url(#synapseCyan)" : "url(#synapsePink)"}
                    strokeWidth={Math.min(4, Math.abs(weight) * 2)}
                    strokeOpacity={0.65}
                  />
                );
              })
            )}

            {/* Synapse Connections Layer 1 -> 2 */}
            {[0, 1, 2].map((i) =>
              [0, 1, 2].map((j) => {
                const x1 = 210;
                const y1 = 80 + i * 80;
                const x2 = 350;
                const y2 = 80 + j * 80;
                const weight = w12[i][j];
                const isPos = weight >= 0;

                return (
                  <line
                    key={`l12-${i}-${j}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isPos ? "url(#synapseCyan)" : "url(#synapsePink)"}
                    strokeWidth={Math.min(4, Math.abs(weight) * 2)}
                    strokeOpacity={0.65}
                  />
                );
              })
            )}

            {/* Synapse Connections Layer 2 -> 3 */}
            {[0, 1, 2].map((i) => {
              const x1 = 350;
              const y1 = 80 + i * 80;
              const x2 = 490;
              const y2 = 160;
              const weight = w23[i];
              const isPos = weight >= 0;

              return (
                <line
                  key={`l23-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isPos ? "url(#synapseCyan)" : "url(#synapsePink)"}
                  strokeWidth={Math.min(4, Math.abs(weight) * 2)}
                  strokeOpacity={0.7}
                />
              );
            })}

            {/* Layer 0 Nodes (Input) */}
            {[0, 1].map((i) => {
              const x = 70;
              const y = i === 0 ? 110 : 210;
              const val = i === 0 ? inputX1 : inputX2;
              return (
                <g key={`n0-${i}`} transform={`translate(${x},${y})`}>
                  <circle r={22} fill="#0f172a" stroke="#00f0ff" strokeWidth={2.5} />
                  <text
                    y={-4}
                    textAnchor="middle"
                    fill="#00f0ff"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {i === 0 ? "X₁" : "X₂"}
                  </text>
                  <text
                    y={10}
                    textAnchor="middle"
                    fill="#cbd5e1"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Layer 1 Nodes (Hidden 1) */}
            {[0, 1, 2].map((j) => {
              const x = 210;
              const y = 80 + j * 80;
              const val = h1[j];
              return (
                <g key={`n1-${j}`} transform={`translate(${x},${y})`}>
                  <circle r={20} fill="#0f172a" stroke="#14b8a6" strokeWidth={2} />
                  <text
                    y={-3}
                    textAnchor="middle"
                    fill="#14b8a6"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    h₁{j + 1}
                  </text>
                  <text
                    y={9}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Layer 2 Nodes (Hidden 2) */}
            {[0, 1, 2].map((j) => {
              const x = 350;
              const y = 80 + j * 80;
              const val = h2[j];
              return (
                <g key={`n2-${j}`} transform={`translate(${x},${y})`}>
                  <circle r={20} fill="#0f172a" stroke="#a855f7" strokeWidth={2} />
                  <text
                    y={-3}
                    textAnchor="middle"
                    fill="#a855f7"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    h₂{j + 1}
                  </text>
                  <text
                    y={9}
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Layer 3 Node (Output) */}
            <g transform="translate(490,160)">
              <circle
                r={26}
                fill="#0f172a"
                stroke={output >= 0.5 ? "#00f0ff" : "#ec4899"}
                strokeWidth={3}
                className="transition-all duration-200"
              />
              <text
                y={-5}
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                Ŷ
              </text>
              <text
                y={11}
                textAnchor="middle"
                fill={output >= 0.5 ? "#00f0ff" : "#ec4899"}
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
              >
                {(output * 100).toFixed(1)}%
              </text>
            </g>
          </svg>
        </div>

        {/* 2D Decision Boundary Canvas & Training Stats (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-bold text-slate-200">
                Decision Boundary (2D)
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {output >= 0.5 ? "Class A (Cyan)" : "Class B (Purple)"}
              </span>
            </div>

            <canvas
              ref={canvasRef}
              width={180}
              height={180}
              className="w-full max-w-[190px] aspect-square rounded-lg border border-slate-700 shadow-inner"
            />
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              จุดสีขาวคือตำแหน่งพิกัด (X₁, X₂) บน Decision Space
            </p>
          </div>

          {/* Loss & Epoch Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Training Epoch:</span>
              <span className="text-base font-bold text-slate-100">{epoch}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Loss (BCE):</span>
              <span className="text-base font-bold text-emerald-400">
                {loss.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Footer */}
      <div className="px-4 py-3 border-t border-slate-800/80 bg-slate-900/40 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Activation Fn Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Activation Function:</span>
          {(["sigmoid", "relu", "tanh", "leaky_relu"] as ActivationFn[]).map((fn) => (
            <button
              key={fn}
              onClick={() => setActivation(fn)}
              className={cn(
                "px-2 py-1 rounded text-xs font-mono transition-colors uppercase",
                activation === fn
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {fn}
            </button>
          ))}
        </div>

        {/* Input Sliders */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">X₁:</span>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={inputX1}
              onChange={(e) => setInputX1(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-cyan-400 font-mono w-8">{inputX1.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">X₂:</span>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={inputX2}
              onChange={(e) => setInputX2(parseFloat(e.target.value))}
              className="w-20 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-cyan-400 font-mono w-8">{inputX2.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
