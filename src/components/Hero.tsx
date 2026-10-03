"use client";

import Image from "next/image";
import { ArrowDownRight } from "@phosphor-icons/react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { profile } from "@/data/content";
import { heroMedia } from "@/lib/media";
import { scrollToId, useLenis } from "./SmoothScroll";
import SplitReveal from "./ui/SplitReveal";
import Magnetic from "./ui/Magnetic";

const Corner = ({ className }: { className: string }) => (
  <span className={`absolute size-6 border-paper/80 md:size-10 ${className}`} />
);

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Au scroll, le plein cadre se referme en viseur pendant que le nom s'écarte
  const insetY = useTransform(scrollYProgress, [0, 0.8], [0, 14]);
  const insetX = useTransform(scrollYProgress, [0, 0.8], [0, 18]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`;
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const firstX = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const lastX = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Fonction plutôt que plage : évite l'accélération ScrollTimeline, imprécise sur un parent sticky
  const cornersOpacity = useTransform(scrollYProgress, (v) => 1 - Math.min(v / 0.3, 1));

  return (
    <section ref={ref} className={reduce ? "relative" : "relative h-[220dvh]"} aria-label="Introduction">
      <div className="sticky top-0 h-dvh min-h-[560px] overflow-hidden">
        <motion.div
          // Pas de fondu : le préchargement se termine sur ce même cadre en plein écran
          style={reduce ? undefined : { clipPath }}
          className="absolute inset-0 bg-ink-3"
        >
          <motion.div style={reduce ? undefined : { scale: mediaScale }} className="absolute inset-0">
            {heroMedia?.type === "video" ? (
              <video
                src={heroMedia.preview ?? heroMedia.src}
                poster={heroMedia.poster ?? undefined}
                autoPlay={!reduce}
                muted
                loop
                playsInline
                className="size-full object-cover"
              />
            ) : heroMedia ? (
              <Image src={heroMedia.src} alt="" fill priority sizes="100vw" className="object-cover" />
            ) : (
              // TODO: vidéo showreel ou photo paysage 1920x1080 dans public/media
              <div className="size-full bg-ink-3" />
            )}
          </motion.div>
          <div className="absolute inset-0 bg-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/60" />
        </motion.div>

        {/* Coins de viseur : cadrent l'image comme dans une caméra */}
        <motion.div
          aria-hidden
          style={reduce ? undefined : { opacity: cornersOpacity }}
          className="pointer-events-none absolute inset-4 md:inset-8"
        >
          <Corner className="left-0 top-0 border-l border-t" />
          <Corner className="right-0 top-0 border-r border-t" />
          <Corner className="bottom-0 left-0 border-b border-l" />
          <Corner className="bottom-0 right-0 border-b border-r" />
        </motion.div>

        <div className="relative flex h-full flex-col justify-center px-4 pt-16 md:px-8">
          <motion.h1
            style={reduce ? undefined : { x: firstX }}
            className="font-display text-[26vw] uppercase leading-[0.82] drop-shadow-[0_4px_30px_rgba(12,12,13,0.35)] md:text-[20vw]"
          >
            <SplitReveal text={profile.firstName} play={ready} delay={0.3} stagger={0.05} />
            <span className="sr-only"> {profile.lastName}</span>
          </motion.h1>

          <div className="flex flex-col gap-5 py-4 md:flex-row md:items-center md:gap-8 md:py-5">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, delay: 1.1 }}
              className="text-2xl font-medium tracking-tight md:text-4xl"
            >
              {profile.role}
            </motion.p>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={ready ? { scaleX: 1 } : undefined}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="hidden h-px flex-1 origin-left bg-paper/60 md:block"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 1, delay: 1.3 }}
            >
              <Magnetic>
                <button
                  onClick={() => scrollToId(lenis, "projets")}
                  className="group flex items-center gap-3 whitespace-nowrap rounded-full bg-paper py-3 pl-6 pr-3 font-medium text-ink transition-transform active:scale-[0.98]"
                >
                  Voir les projets
                  <span className="flex size-8 items-center justify-center rounded-full bg-rec transition-transform duration-500 group-hover:rotate-45">
                    <ArrowDownRight size={16} weight="bold" />
                  </span>
                </button>
              </Magnetic>
            </motion.div>
          </div>

          <motion.p
            aria-hidden
            style={reduce ? undefined : { x: lastX }}
            className="self-end font-display text-[26vw] uppercase leading-[0.82] drop-shadow-[0_4px_30px_rgba(12,12,13,0.35)] md:text-[20vw]"
          >
            <SplitReveal text={profile.lastName} play={ready} delay={0.55} stagger={0.05} />
          </motion.p>
        </div>
      </div>
    </section>
  );
}
