"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  baseY: number;
  layer: number;
  index: number;
  phase: number;
}

interface PathSegment {
  from: Node;
  to: Node;
}

interface Journey {
  path: PathSegment[];
  totalProgress: number; // 0 to path.length (continuous across all segments)
  speed: number;
}

export default function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let nodes: Node[] = [];
    let time = 0;

    // More nodes per layer, layers closer together → steeper angles
    const LAYERS = [2, 4, 6, 4, 2];
    const NODE_OPACITY = 0.07;
    const LINE_OPACITY = 0.015;
    const PULSE_OPACITY = 0.18;
    const DRIFT_AMOUNT = 3;
    const TAIL_LENGTH = 1.8; // in "segments" — how far the fade trail extends behind

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildNetwork();
    }

    function buildNetwork() {
      if (!canvas) return;
      nodes = [];

      // Narrower horizontal spacing, taller vertical spread → steeper connections
      const paddingX = canvas.width * 0.25;
      const paddingY = canvas.height * 0.1;
      const usableWidth = canvas.width - paddingX * 2;
      const usableHeight = canvas.height - paddingY * 2;
      const layerSpacing = usableWidth / (LAYERS.length - 1);

      for (let l = 0; l < LAYERS.length; l++) {
        const count = LAYERS[l];
        const nodeSpacing = usableHeight / (count + 1);

        for (let n = 0; n < count; n++) {
          const x = paddingX + l * layerSpacing;
          const y = paddingY + (n + 1) * nodeSpacing;

          nodes.push({
            x,
            y,
            baseY: y,
            layer: l,
            index: n,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function getLayerNodes(layer: number): Node[] {
      return nodes.filter((n) => n.layer === layer);
    }

    function buildJourney(): Journey {
      const path: PathSegment[] = [];
      let prev: Node | null = null;

      for (let l = 0; l < LAYERS.length; l++) {
        const layerNodes = getLayerNodes(l);
        const node = layerNodes[Math.floor(Math.random() * layerNodes.length)];
        if (prev) {
          path.push({ from: prev, to: node });
        }
        prev = node;
      }

      return {
        path,
        totalProgress: 0,
        speed: 0.003 + Math.random() * 0.001, // much slower
      };
    }

    // Keep two journeys: current and next (overlapping)
    let journeys: Journey[] = [];

    function ensureJourneys() {
      // Remove finished journeys (fully faded out)
      journeys = journeys.filter(
        (j) => j.totalProgress < j.path.length + TAIL_LENGTH
      );

      // Check if we need a new one: spawn when the leading journey is ~75% done
      const leading = journeys[journeys.length - 1];
      if (
        !leading ||
        leading.totalProgress >= leading.path.length * 0.75
      ) {
        journeys.push(buildJourney());
      }
    }

    // Smooth ease for each segment
    function easeInOut(t: number): number {
      return t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    // Get x,y position along the full path at a given progress value
    function getPositionAt(path: PathSegment[], progress: number): { x: number; y: number } | null {
      if (progress < 0) return null;
      const seg = Math.floor(progress);
      if (seg >= path.length) return null;
      const t = easeInOut(progress - seg);
      const s = path[seg];
      return {
        x: s.from.x + (s.to.x - s.from.x) * t,
        y: s.from.y + (s.to.y - s.from.y) * t,
      };
    }

    function drawJourney(j: Journey) {
      if (!ctx) return;

      j.totalProgress += j.speed;

      const steps = 80;
      const headPos = Math.min(j.totalProgress, j.path.length);
      const tailStart = j.totalProgress - TAIL_LENGTH;

      // Draw fading trail
      for (let i = 0; i < steps; i++) {
        const p0 = tailStart + (headPos - tailStart) * (i / steps);
        const p1 = tailStart + (headPos - tailStart) * ((i + 1) / steps);

        const pos0 = getPositionAt(j.path, p0);
        const pos1 = getPositionAt(j.path, p1);

        if (!pos0 || !pos1) continue;

        const fade = (i + 1) / steps;
        const opacity = fade * 0.1;

        ctx.beginPath();
        ctx.moveTo(pos0.x, pos0.y);
        ctx.lineTo(pos1.x, pos1.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 0.5 + fade * 0.5;
        ctx.stroke();
      }

      // Ball at the head (only if head hasn't passed the end)
      if (j.totalProgress < j.path.length) {
        const headXY = getPositionAt(j.path, headPos);
        if (headXY) {
          const gradient = ctx.createRadialGradient(
            headXY.x, headXY.y, 0,
            headXY.x, headXY.y, 6
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${PULSE_OPACITY})`);
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.beginPath();
          ctx.arc(headXY.x, headXY.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(headXY.x, headXY.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${PULSE_OPACITY * 0.6})`;
          ctx.fill();
        }
      }
    }

    function draw() {
      if (!ctx || !canvas) return;
      time += 0.01;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Breathe
      for (const node of nodes) {
        node.y = node.baseY + Math.sin(time * 0.4 + node.phase) * DRIFT_AMOUNT;
      }

      // Draw connections (very faint)
      for (let l = 0; l < LAYERS.length - 1; l++) {
        const currentLayer = getLayerNodes(l);
        const nextLayer = getLayerNodes(l + 1);
        for (const from of currentLayer) {
          for (const to of nextLayer) {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${LINE_OPACITY})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const glow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, 8
        );
        glow.addColorStop(0, `rgba(255, 255, 255, ${NODE_OPACITY * 0.5})`);
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${NODE_OPACITY})`;
        ctx.fill();
      }

      // Draw all active journeys
      ensureJourneys();
      for (const j of journeys) {
        drawJourney(j);
      }

      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
