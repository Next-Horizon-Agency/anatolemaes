"use client";

import Image from "next/image";
import { Play } from "@phosphor-icons/react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { allMedia, projects, type Media, type Project, type Video } from "@/lib/media";
import Lightbox from "./Lightbox";
import SplitReveal from "./ui/SplitReveal";

const plural = (n: number, word: string) => `${n} ${word}${n > 1 ? "s" : ""}`;

/** Aperçu muet qui ne tourne que lorsqu'il est à l'écran. */
function VideoPreview({ video }: { video: Video }) {
  const ref = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [inView, reduce]);

  return (
    <>
      <video
        ref={ref}
        src={video.preview ?? video.src}
        poster={video.poster ?? undefined}
        muted
        loop
        playsInline
        preload="none"
        className="size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-paper py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink shadow-lg shadow-ink/30 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <span className="flex size-7 items-center justify-center rounded-full bg-rec">
          <Play size={12} weight="fill" />
        </span>
        Lire
      </span>
    </>
  );
}

/**
 * Tuile d'une grille « justifiée » : toutes les tuiles d'une ligne ont la même hauteur
 * et leur largeur suit le format du média (9:16, 16:9, 3:2…).
 */
function Tile({ item, label, index, onOpen }: { item: Media; label: string; index: number; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const ratio = item.width / item.height;
  return (
    <motion.button
      initial={reduce ? false : { opacity: 0, y: 50, clipPath: "inset(15% 0% 0% 0%)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onClick={onOpen}
      aria-label={label}
      className="group relative overflow-hidden bg-ink-3"
      style={{
        aspectRatio: `${item.width} / ${item.height}`,
        flexGrow: ratio,
        flexBasis: `calc(${ratio} * var(--row-h))`,
      }}
    >
      {item.type === "video" ? (
        <VideoPreview video={item} />
      ) : (
        <Image
          src={item.src}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover grayscale-[40%] transition duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
        />
      )}
    </motion.button>
  );
}

function ProjectBlock({ project, onOpen }: { project: Project; onOpen: (m: Media) => void }) {
  const videos = project.items.filter((m) => m.type === "video").length;
  const photos = project.items.length - videos;
  const counts = [videos && plural(videos, "vidéo"), photos && plural(photos, "photo")].filter(Boolean).join(", ");

  return (
    <article className="grid grid-cols-1 gap-8 border-t border-paper/10 pt-8 md:grid-cols-12 md:gap-10 md:pt-10">
      {/* Titre collant : reste en vue pendant qu'on parcourt les médias du projet */}
      <div className="self-start md:sticky md:top-24 md:col-span-4">
        <h3 className="font-display text-[11vw] uppercase leading-[0.92] md:text-[3.6vw]">
          <SplitReveal text={project.title} stagger={0.02} />
        </h3>
        <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-mute">
          {project.category && (
            <span className="rounded-full border border-paper/25 px-3 py-1 text-paper">{project.category}</span>
          )}
          {counts}
        </p>
        {project.description?.map((paragraph, i) => (
          <p key={i} className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-paper/75 first-of-type:mt-6">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Hauteur de ligne selon le contenu : peu de médias verticaux = lignes hautes */}
      <div
        className={`flex flex-wrap gap-2 md:col-span-8 md:gap-3 ${
          project.items.length > 2
            ? "[--row-h:170px] md:[--row-h:180px] xl:[--row-h:220px]"
            : project.items.every((m) => m.height > m.width)
              ? "[--row-h:240px] md:[--row-h:380px] xl:[--row-h:440px]"
              : "[--row-h:200px] md:[--row-h:300px] xl:[--row-h:360px]"
        }`}
      >
        {project.items.map((item, i) => (
          <Tile
            key={item.id}
            item={item}
            index={i}
            onOpen={() => onOpen(item)}
            label={`${project.title}, ${item.type === "video" ? "lire la vidéo" : "agrandir la photo"} ${i + 1}`}
          />
        ))}
        {/* Absorbe l'espace de la dernière ligne pour ne pas étirer ses tuiles */}
        <span aria-hidden className="grow-[10] basis-0" />
      </div>
    </article>
  );
}

export default function Projects() {
  const [open, setOpen] = useState<number | null>(null);
  const openMedia = (m: Media) => setOpen(allMedia.indexOf(m));

  return (
    <section id="projets" className="mx-auto max-w-[1400px] px-4 py-24 md:px-10 md:py-40" aria-labelledby="projets-titre">
      <h2 id="projets-titre" className="font-display text-[16vw] uppercase leading-[0.85] md:text-[9vw]">
        Pro<span className="text-outline">jets</span>
      </h2>

      {projects.length === 0 ? (
        <p className="mt-12 max-w-[50ch] text-lg text-mute">Les projets photo et vidéo seront publiés ici très prochainement.</p>
      ) : (
        <div className="mt-16 flex flex-col gap-24 md:mt-24 md:gap-36">
          {projects.map((p) => (
            <ProjectBlock key={p.title} project={p} onOpen={openMedia} />
          ))}
        </div>
      )}

      <Lightbox items={allMedia} index={open} onChange={setOpen} />
    </section>
  );
}
