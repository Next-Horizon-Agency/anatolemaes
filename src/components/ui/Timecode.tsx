"use client";

import { useAnimationFrame } from "motion/react";
import { useRef } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/** Timecode HH:MM:SS:FF qui défile depuis l'ouverture de la page (25 fps). */
export default function Timecode({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useAnimationFrame((t) => {
    if (!ref.current) return;
    const frames = Math.floor((t / 1000) * 25);
    const f = frames % 25;
    const s = Math.floor(frames / 25);
    ref.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
  });
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      00:00:00:00
    </span>
  );
}
