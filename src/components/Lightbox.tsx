"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect } from "react";
import type { Media } from "@/lib/media";
import { useLenis } from "./SmoothScroll";

type Props = {
  items: Media[];
  index: number | null;
  onChange: (index: number | null) => void;
};

const iconButton =
  "flex size-12 items-center justify-center rounded-full border border-paper/25 bg-ink/60 text-paper backdrop-blur transition hover:border-rec hover:bg-rec hover:text-ink active:scale-[0.96]";

export default function Lightbox({ items, index, onChange }: Props) {
  const lenis = useLenis();
  const open = index !== null;
  const item = open ? items[index] : null;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [open, lenis, go, onChange]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Aperçu du média"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm md:p-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onChange(null)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={item.src}
              initial={{ opacity: 0, scale: 0.96, clipPath: "inset(8% 8% 8% 8%)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {item.type === "video" ? (
                <video
                  src={item.src}
                  poster={item.poster ?? undefined}
                  controls
                  autoPlay
                  playsInline
                  className="size-full object-contain"
                />
              ) : (
                <Image src={item.src} alt="" fill sizes="100vw" className="object-contain" />
              )}
            </motion.div>
          </AnimatePresence>

          <button onClick={() => onChange(null)} className={`${iconButton} absolute right-4 top-4 md:right-8 md:top-8`} aria-label="Fermer">
            <X size={20} weight="bold" />
          </button>
          {items.length > 1 && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3 md:bottom-8" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => go(-1)} className={iconButton} aria-label="Précédent">
                <ArrowLeft size={20} weight="bold" />
              </button>
              <button onClick={() => go(1)} className={iconButton} aria-label="Suivant">
                <ArrowRight size={20} weight="bold" />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
