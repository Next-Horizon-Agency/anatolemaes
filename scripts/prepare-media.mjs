// Convertit le dossier Source (un sous-dossier par projet) en médias optimisés pour le web.
//   node scripts/prepare-media.mjs "<dossier source>"
// Nécessite ffmpeg (variable FFMPEG ou dans le PATH).
//
// Pour chaque vidéo : <nom>.mp4 (H.264, lecture complète avec son),
// <nom>-preview.mp4 (720p, muet, 12 s, pour les vignettes) et <nom>.jpg (couverture).
// Les photos sont copiées telles quelles (Next/Image s'occupe du redimensionnement).
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, parse } from "node:path";

const src = process.argv[2];
if (!src || !existsSync(src)) {
  console.error("Usage : node scripts/prepare-media.mjs <dossier source>");
  process.exit(1);
}
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const out = join(process.cwd(), "public", "media");

const slug = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Début de l'aperçu et de la couverture (en secondes) quand la vidéo commence mal
// (carton, écran noir…). Clé : <dossier>/<fichier>, noms convertis comme sur le site.
const OFFSETS = {
  "automobile/toyota": 36,
  "automobile/lot": 4,
};

const IMG = /\.(jpe?g|png|webp|avif)$/i;
const VID = /\.(mp4|mov|m4v|webm)$/i;
const run = (args) => execFileSync(ffmpeg, ["-y", "-loglevel", "error", ...args], { stdio: "inherit" });

// Accepte Source/<projet>/… ou Source/<n'importe quoi>/<projet>/…
const projectDirs = [];
const walk = (dir) => {
  const entries = readdirSync(dir).filter((f) => !f.startsWith("."));
  if (entries.some((f) => IMG.test(f) || VID.test(f))) projectDirs.push(dir);
  entries.map((f) => join(dir, f)).filter((p) => statSync(p).isDirectory()).forEach(walk);
};
walk(src);

for (const dir of projectDirs) {
  const project = slug(parse(dir).base);
  const dest = join(out, project);
  mkdirSync(dest, { recursive: true });

  for (const file of readdirSync(dir).filter((f) => !f.startsWith("."))) {
    const input = join(dir, file);
    const base = slug(parse(file).name);

    if (IMG.test(file)) {
      const target = join(dest, `${base}${parse(file).ext.toLowerCase()}`);
      if (!existsSync(target)) copyFileSync(input, target);
      console.log(`photo  ${project}/${base}`);
      continue;
    }
    if (!VID.test(file)) continue;

    const full = join(dest, `${base}.mp4`);
    const preview = join(dest, `${base}-preview.mp4`);
    const poster = join(dest, `${base}.jpg`);
    // Plus grand côté limité à 1920 px, orientation conservée
    const scale = "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))'";
    const scalePreview = "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'";

    if (!existsSync(full)) {
      run(["-i", input, "-vf", `${scale},format=yuv420p`, "-c:v", "libx264", "-preset", "slow", "-crf", "24",
        "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", full]);
    }
    const start = String(OFFSETS[`${project}/${base}`] ?? 0);
    if (!existsSync(preview)) {
      run(["-ss", start, "-i", input, "-t", "12", "-an", "-vf", `${scalePreview},fps=25,format=yuv420p`, "-c:v", "libx264",
        "-preset", "slow", "-crf", "28", "-movflags", "+faststart", preview]);
    }
    if (!existsSync(poster)) {
      run(["-ss", String(Number(start) + 2), "-i", input, "-frames:v", "1", "-vf", `thumbnail=150,${scale}`, "-q:v", "3", poster]);
    }
    console.log(`vidéo  ${project}/${base}`);
  }
}
