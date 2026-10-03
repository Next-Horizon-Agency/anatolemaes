"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Si fourni, l'animation suit ce booléen plutôt que l'entrée dans le viewport. */
  play?: boolean;
};

/** Titre dont chaque lettre sort d'un masque par le bas. */
export default function SplitReveal({ text, className = "", delay = 0, stagger = 0.04, play }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  // On observe le conteneur : les lettres, cachées sous le masque, ne sont jamais « visibles »
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const shown = play ?? inView;

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      <span className="sr-only">{text}</span>
      {/* Passage à la ligne entre les mots, jamais au milieu d'un mot. Marge verticale du masque : les lettres rondes (O, S) débordent de la ligne */}
      {text.split(" ").map((word, w, words) => {
        const offset = words.slice(0, w).join(" ").length + (w > 0 ? 1 : 0);
        return (
          <span key={w} aria-hidden className="-my-[0.15em] inline-flex overflow-hidden py-[0.15em]">
            {word.split("").map((char, i) => (
              <motion.span
                key={i}
                className="inline-block will-change-transform"
                initial={reduce ? false : { y: "110%", rotate: 8 }}
                animate={shown ? { y: "0%", rotate: 0 } : undefined}
                transition={{ duration: 1, delay: delay + (offset + i) * stagger, ease: [0.22, 1, 0.36, 1] }}
              >
                {char}
              </motion.span>
            ))}
            {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        );
      })}
    </span>
  );
}
