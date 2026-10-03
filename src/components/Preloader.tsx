"use client";

import Image from "next/image";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "@/data/content";
import { heroMedia } from "@/lib/media";

const EASE = [0.76, 0, 0.24, 1] as const;
const cover = heroMedia?.type === "video" ? heroMedia.poster : heroMedia?.src;

/**
 * Un petit viseur s'ouvre au centre, le compteur monte jusqu'à 100,
 * puis le cadre s'agrandit jusqu'au plein écran et devient le hero :
 * l'inverse exact du hero qui se referme en viseur au scroll.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  const count = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const [ready, setReady] = useState(!cover);
  const [open, setOpen] = useState(false);
  // Fenêtre du viseur (en % depuis chaque bord), plus large sur mobile
  const [win, setWin] = useState({ y: 36, x: 36 });

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    if (window.innerWidth < 768) setWin({ y: 38, x: 18 });
    // Filet de sécurité si l'image tarde à charger
    const t = setTimeout(() => setReady(true), 1500);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const controls = animate(progress, 100, {
      duration: reduce ? 0.4 : 1.6,
      delay: reduce ? 0 : 0.5,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setOpen(true),
    });
    return () => controls.stop();
  }, [ready, reduce, progress]);

  const windowClip = `inset(${win.y}% ${win.x}% ${win.y}% ${win.x}%)`;

  return (
    <motion.div
      role="status"
      aria-label="Chargement"
      className="fixed inset-0 z-[80] overflow-hidden bg-ink"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: "inset(50% 50% 50% 50%)" }}
        animate={{ clipPath: open ? "inset(0% 0% 0% 0%)" : ready ? windowClip : "inset(50% 50% 50% 50%)" }}
        transition={{ duration: open ? 1.2 : 0.9, ease: EASE }}
        onAnimationComplete={() => open && onDone()}
      >
        {cover && (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.25 }}
            animate={{ scale: open ? 1.15 : 1.25 }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <Image src={cover} alt="" fill priority sizes="(orientation: portrait) 190vh, 100vw" className="object-cover" onLoad={() => setReady(true)} />
          </motion.div>
        )}
        {/* Mêmes voiles que le hero, posés pendant l'ouverture pour un raccord invisible */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 1.2, ease: EASE }}
        >
          <div className="absolute inset-0 bg-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/60" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute flex items-baseline justify-between gap-4 text-sm"
        style={{ top: `calc(${100 - win.y}% + 14px)`, left: `${win.x}%`, right: `${win.x}%` }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: ready && !open ? 1 : 0, y: ready && !open ? 0 : 8 }}
        transition={{ duration: 0.5, delay: ready && !open ? 0.4 : 0 }}
      >
        <span className="font-medium">
          {profile.firstName} {profile.lastName}
        </span>
        <motion.span className="font-mono tabular-nums text-mute">{count}</motion.span>
      </motion.div>
    </motion.div>
  );
}
