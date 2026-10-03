"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { useRef } from "react";

/** Bandeau défilant dont la vitesse et le sens suivent le scroll. */
export default function VelocityMarquee({
  items,
  baseVelocity = -2,
  className = "",
}: {
  items: string[];
  baseVelocity?: number;
  className?: string;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);
  const reduce = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const row = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8 pr-8">
          <span>{item}</span>
          <span aria-hidden className="text-rec">/</span>
        </span>
      ))}
    </>
  );

  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex flex-nowrap" style={{ x }}>
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
