"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { scrollToId, useLenis } from "./SmoothScroll";

const links = [
  { id: "parcours", label: "Parcours" },
  { id: "competences", label: "Compétences" },
  { id: "projets", label: "Projets" },
  { id: "contact", label: "Contact" },
];

/** Texte qui « roule » vers le haut au survol. */
function RollText({ children }: { children: string }) {
  return (
    <span className="relative inline-block overflow-hidden align-top">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
      >
        {children}
      </span>
    </span>
  );
}

export default function Nav({ ready }: { ready: boolean }) {
  const lenis = useLenis();
  const { scrollY, scrollYProgress } = useScroll();
  const [hidden, setHidden] = useState(false);

  // Booléen discret (pas une valeur continue) : la nav se cache en descendant
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > (scrollY.getPrevious() ?? 0) && y > 200;
    if (next !== hidden) setHidden(next);
  });

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={ready ? { y: hidden ? -80 : 0, opacity: 1 } : undefined}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-40"
      >
        <nav className="flex h-16 items-center justify-between px-4 text-sm text-paper md:h-18 md:px-10">
          <button
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
            className="font-display text-2xl"
            aria-label="Retour en haut"
          >
            A<span className="text-rec">.</span>M
          </button>

          <ul className="flex gap-5 md:gap-9">
            {links.map((l) => (
              <li key={l.id} className={l.id === "competences" ? "hidden md:block" : ""}>
                <button onClick={() => scrollToId(lenis, l.id)} className="group font-medium">
                  <RollText>{l.label}</RollText>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </motion.header>

      {/* Progression de lecture, comme une barre de lecture vidéo */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-rec"
      />
    </>
  );
}
