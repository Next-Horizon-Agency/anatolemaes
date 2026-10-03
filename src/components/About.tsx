"use client";

import Image from "next/image";
import { motion, MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { profile } from "@/data/content";

/** Chaque mot s'allume à mesure qu'on le lit : le texte se « développe » comme une photo. */
function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  // Fonction plutôt que plage : évite l'accélération ScrollTimeline (imprécise ici)
  const opacity = useTransform(progress, (v) => 0.14 + 0.86 * Math.min(Math.max((v - range[0]) / (range[1] - range[0]), 0), 1));
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

const tags = ["Photo", "Vidéo", "Drone", "Montage", "Réseaux sociaux"];

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const photoRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const { scrollYProgress: photoProgress } = useScroll({ target: photoRef, offset: ["start end", "end start"] });
  const photoY = useTransform(photoProgress, [0, 1], ["-8%", "8%"]);
  // Obturateur lié au scroll plutôt qu'à whileInView : toujours juste, même après un rechargement en bas de page
  const shutter = useTransform(photoProgress, (v) => `inset(${100 - 100 * Math.min(Math.max(v / 0.4, 0), 1)}% 0% 0% 0%)`);
  const words = profile.intro.split(" ");

  return (
    <section id="a-propos" className="mx-auto max-w-[1400px] px-4 py-32 md:px-10 md:py-48" aria-label="À propos">
      {/* Portrait et texte forment un seul bloc : le texte occupe toute la hauteur de la photo */}
      <div className="grid gap-12 md:grid-cols-12 md:gap-[4vw]">
        <figure ref={photoRef} className="md:col-span-4">
          {/* Portrait : se dévoile comme un obturateur qui s'ouvre */}
          <motion.div
            style={reduce ? undefined : { clipPath: shutter }}
            className="relative aspect-[4/5] overflow-hidden bg-ink-3 md:aspect-[1061/1483]"
          >
            <motion.div style={reduce ? undefined : { y: photoY }} className="absolute -inset-y-[8%] inset-x-0">
              <Image
                src="/media/anatole_maes.jpg"
                alt={`Portrait de ${profile.firstName} ${profile.lastName}`}
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
              />
            </motion.div>
          </motion.div>
        </figure>

        <div className="flex flex-col justify-between gap-10 md:col-span-8">
          <p
            ref={ref}
            className="text-pretty text-[8vw] font-medium leading-[1.08] tracking-tight md:text-[clamp(2rem,4vw,3.5rem)]"
          >
            {reduce
              ? profile.intro
              : words.map((w, i) => {
                  const start = i / words.length;
                  return (
                    <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]}>
                      {w}
                    </Word>
                  );
                })}
          </p>

          <ul className="flex flex-wrap gap-3">
            {tags.map((t, i) => (
              <motion.li
                key={t}
                initial={reduce ? false : { opacity: 0, y: 20, rotate: -4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
                className="rounded-full border border-paper/25 px-5 py-2 text-sm transition-colors duration-300 hover:border-rec hover:bg-rec hover:text-ink"
              >
                {t}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
