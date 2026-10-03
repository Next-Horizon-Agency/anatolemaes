"use client";

import { motion, useReducedMotion } from "motion/react";
import { hardSkills, softSkills } from "@/data/content";
import VelocityMarquee from "./ui/VelocityMarquee";

type Skill = { title: string; text: string };

function Group({ title, skills, offset }: { title: string; skills: Skill[]; offset?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className={offset ? "md:mt-40" : ""}>
      <h3 className="text-lg font-medium text-mute">{title}</h3>
      <ul className="mt-8 flex flex-col gap-10 md:gap-14">
        {skills.map((s, i) => (
          <motion.li
            key={s.title}
            initial={reduce ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="group"
          >
            <p className="font-display text-4xl uppercase leading-[0.95] transition-[color,translate] duration-500 group-hover:translate-x-3 group-hover:text-rec md:text-6xl">
              {s.title}
            </p>
            <p className="mt-3 max-w-[42ch] leading-relaxed text-paper/75">{s.text}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="competences" className="py-24 md:py-40" aria-labelledby="competences-titre">
      {/* Unique bandeau défilant de la page : balaie l'étendue du métier */}
      <VelocityMarquee
        items={["Prise de vue", "Montage", "Drone", "Format 9:16", "Format 16:9", "Reportage photo", "Post-production"]}
        className="border-y border-paper/10 py-6 font-display text-[12vw] uppercase leading-none md:text-[7vw]"
      />

      <div className="mx-auto max-w-[1400px] px-4 pt-24 md:px-10 md:pt-40">
        <h2 id="competences-titre" className="font-display text-[16vw] uppercase leading-[0.85] md:text-[9vw]">
          Compé<span className="text-outline">tences</span>
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-20 md:mt-24 md:grid-cols-2 md:gap-16">
          <Group title="Savoir-faire" skills={hardSkills} />
          <Group title="Savoir-être" skills={softSkills} offset />
        </div>
      </div>
    </section>
  );
}
