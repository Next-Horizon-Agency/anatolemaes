import data from "@/data/media.json";
import { heroMediaId, projects as projectsContent } from "@/data/content";

export type Photo = { type: "photo"; id: string; src: string; width: number; height: number };
export type Video = {
  type: "video";
  id: string;
  src: string;
  preview: string | null;
  poster: string | null;
  width: number;
  height: number;
};
export type Media = Photo | Video;
export type Project = { title: string; category?: string; description?: string[]; items: Media[] };

const byId = new Map(
  (data.projects as { slug: string; items: Media[] }[]).flatMap((p) => p.items).map((m) => [m.id, m]),
);

if (process.env.NODE_ENV !== "production") {
  const missing = projectsContent.flatMap((p) => p.media).filter((id) => !byId.has(id));
  if (missing.length) console.warn(`Médias introuvables dans media.json : ${missing.join(", ")}`);
}

export const projects: Project[] = projectsContent
  .map(({ media, ...rest }) => ({
    ...rest,
    items: media.map((id) => byId.get(id)).filter((m): m is Media => !!m),
  }))
  .filter((p) => p.items.length > 0);

export const allMedia: Media[] = projects.flatMap((p) => p.items);

const isLandscapeVideo = (m: Media): m is Video => m.type === "video" && m.width > m.height;

/** Média de fond du hero : celui choisi dans content.ts, sinon la première vidéo paysage. */
export const heroMedia: Media | undefined =
  byId.get(heroMediaId) ?? allMedia.find(isLandscapeVideo) ?? allMedia[0];
