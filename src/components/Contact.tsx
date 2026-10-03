"use client";

import { ArrowUp, ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { profile } from "@/data/content";
import { useLenis } from "./SmoothScroll";
import Magnetic from "./ui/Magnetic";

/** Lettres qui roulent une par une au survol. */
function RollLetters({ text }: { text: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="sr-only">{text}</span>
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden className="relative inline-block">
          <span
            className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 12}ms` }}
          >
            {c}
          </span>
          <span
            className="absolute left-0 top-full block text-rec transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 12}ms` }}
          >
            {c}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // Le titre « Action » monte et s'élargit comme un générique de fin
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden border-t border-paper/10 bg-ink-2">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-between px-4 pb-8 pt-24 md:px-10 md:pt-32">
        <motion.h2
          style={reduce ? undefined : { scale, y }}
          className="origin-bottom-left font-display text-[24vw] uppercase leading-[0.8] md:text-[17vw]"
        >
          Action<span className="text-rec">.</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr] md:items-end">
          <div>
            <p className="text-lg text-mute">Un tournage, un reportage, un projet de contenu ?</p>
            <a
              href={`mailto:${profile.email}`}
              className="group mt-4 block break-all text-[7.5vw] font-medium leading-[1.1] tracking-tight md:text-[3.6vw]"
            >
              <RollLetters text={profile.email} />
            </a>
            <button
              onClick={copy}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-paper/25 px-4 py-2 text-sm transition hover:border-paper active:scale-[0.98]"
            >
              {copied ? <Check size={16} weight="bold" className="text-rec" /> : <Copy size={16} />}
              {copied ? "Adresse copiée" : "Copier l’adresse"}
            </button>
          </div>

          <dl className="grid gap-6 text-lg">
            <div>
              <dt className="text-sm text-mute">Téléphone</dt>
              <dd>
                <a href={profile.phoneHref} className="group inline-flex items-center gap-2 hover:text-rec">
                  {profile.phone}
                  <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-mute">Adresse</dt>
              <dd>{profile.location}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-20 flex items-center justify-between border-t border-paper/10 pt-6 text-sm text-mute">
          <p>© {new Date().getFullYear()} Anatole Maes</p>
          <Magnetic>
            <button
              onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
              className="flex size-12 items-center justify-center rounded-full border border-paper/25 text-paper transition hover:border-rec hover:bg-rec hover:text-ink active:scale-[0.96]"
              aria-label="Retour en haut"
            >
              <ArrowUp size={18} weight="bold" />
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
