"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { timeline, type TimelineItem } from "@/data/content";

// Ordre chronologique : la pellicule se lit de gauche à droite
const items = [...timeline].reverse();

function CardBody({ item, active }: { item: TimelineItem; active: boolean }) {
  const isXp = item.kind === "experience";
  return (
    <>
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
          isXp ? "bg-rec text-ink" : "border border-paper/30 text-paper"
        }`}
      >
        {isXp ? "Expérience" : "Formation"}
      </span>
      <p
        className={`mt-6 font-display text-5xl leading-none transition-colors duration-500 md:text-7xl ${
          active ? "text-paper" : "text-outline"
        }`}
      >
        {item.period}
      </p>
      <h3 className="mt-5 text-xl font-medium leading-tight tracking-tight md:text-2xl">{item.title}</h3>
      <p className="mt-1 text-lg text-paper/80">
        {item.place}, <span className="text-mute">{item.city}</span>
      </p>
      {item.summary && <p className="mt-5 max-w-[65ch] text-sm leading-relaxed text-paper/85">{item.summary}</p>}
      {item.details && <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-mute">{item.details}</p>}
    </>
  );
}

function Card({ item, index, active, onActive }: { item: TimelineItem; index: number; active: boolean; onActive: () => void }) {
  const offset = index % 2 === 1;
  return (
    <motion.article
      onViewportEnter={onActive}
      // Actif quand la carte croise la tête de lecture (centre de l'écran)
      viewport={{ margin: "0px -50% 0px -50%" }}
      className={`relative w-[80vw] shrink-0 sm:w-[55vw] md:w-[38vw] lg:w-[30vw] ${offset ? "md:mt-20" : ""}`}
    >
      {/* Nœud sur la ligne : état actif réel, pas une décoration */}
      <span className="absolute left-0 top-6 -translate-x-1/2 -translate-y-1/2">
        <motion.span
          animate={{ scale: active ? 1 : 0.55, backgroundColor: active ? "#e5532e" : "#ededeb" }}
          className="block size-4 rounded-full"
        />
        <AnimatePresence>
          {active && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-rec"
            />
          )}
        </AnimatePresence>
      </span>
      <motion.span
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className={`absolute left-0 top-6 h-14 w-px origin-top bg-paper/30 ${offset ? "md:h-34" : ""}`}
      />

      <motion.div
        initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 40 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }}
        viewport={{ once: true, margin: "0px -10% 0px 0px" }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        className={`relative mt-20 border p-6 transition-colors duration-500 md:p-8 ${
          active ? "border-rec/70 bg-ink-2" : "border-paper/15 bg-ink-2/60"
        }`}
      >
        <CardBody item={item} active={active} />
      </motion.div>
    </motion.article>
  );
}

/** Version sans défilement horizontal pour « réduire les animations ». */
function StaticTimeline() {
  return (
    <section id="parcours" className="mx-auto max-w-[1400px] px-4 py-24 md:px-10">
      <h2 className="font-display text-[16vw] uppercase leading-[0.85] md:text-[9vw]">Le parcours</h2>
      <ol className="mt-12 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.place + item.period} className="border border-paper/15 bg-ink-2 p-6 md:p-8">
            <CardBody item={item} active />
          </li>
        ))}
      </ol>
    </section>
  );
}

function PinnedTimeline() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [vw, setVw] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setVw(window.innerWidth);
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * distance);
  // La ligne rouge s'arrête toujours sur la tête de lecture
  const fill = useTransform(scrollYProgress, (p) => p * distance + vw / 2);
  const titleX = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section
      id="parcours"
      ref={section}
      className="relative"
      // Longueur de scroll = distance horizontale à parcourir
      style={{ height: `calc(${distance}px + 100dvh)` }}
    >
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
        <div className="sprockets h-3 shrink-0 bg-paper/10" />

        <motion.h2
          style={{ x: titleX }}
          className="whitespace-nowrap px-4 pt-20 font-display text-[16vw] uppercase leading-[0.85] md:px-10 md:text-[9vw]"
        >
          Le <span className="text-outline">parcours</span>
        </motion.h2>

        <div className="relative mt-6 flex-1 md:mt-0">
          {/* Tête de lecture, comme sur une timeline de montage */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-rec/70">
            <span className="absolute -top-1 left-1/2 -translate-x-1/2 overflow-hidden whitespace-nowrap rounded-full bg-rec px-3 py-1 font-mono text-xs text-ink">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  className="block"
                >
                  {items[active].period}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <motion.div
            ref={track}
            style={{ x }}
            className="relative z-10 mt-10 flex w-max items-start gap-[8vw] pl-[50vw] pr-[45vw] md:gap-[6vw]"
          >
            {/* Règle graduée */}
            <div
              className="absolute inset-x-0 top-0 h-3 opacity-30"
              style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--color-paper) 0 1px, transparent 1px 24px)" }}
            />
            <div className="absolute inset-x-0 top-6 h-px bg-paper/20" />
            <motion.div style={{ width: fill }} className="absolute left-0 top-6 h-[2px] -translate-y-px bg-rec" />

            {items.map((item, i) => (
              <Card
                key={item.place + item.period}
                item={item}
                index={i}
                active={active === i}
                onActive={() => setActive(i)}
              />
            ))}
          </motion.div>
        </div>

        <div className="sprockets h-3 shrink-0 bg-paper/10" />
      </div>
    </section>
  );
}

export default function Timeline() {
  const reduce = useReducedMotion();
  return reduce ? <StaticTimeline /> : <PinnedTimeline />;
}
