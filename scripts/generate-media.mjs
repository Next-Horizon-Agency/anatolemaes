// Scanne public/media/<projet>/ et génère src/data/media.json.
// Produit par scripts/prepare-media.mjs, relancé automatiquement avant dev/build.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, parse } from "node:path";
import { imageSize } from "image-size";

const root = process.cwd();
const mediaDir = join(root, "public", "media");
const outFile = join(root, "src", "data", "media.json");

const IMG = /\.(jpe?g|png|webp|avif)$/i;
const sortFr = (a, b) => a.localeCompare(b, "fr", { numeric: true });

const sizeOf = (file) => {
  try {
    const s = imageSize(readFileSync(file));
    const rotated = s.orientation && s.orientation >= 5;
    return rotated ? { width: s.height, height: s.width } : { width: s.width, height: s.height };
  } catch {
    return { width: 1920, height: 1080 };
  }
};

const projects = (existsSync(mediaDir) ? readdirSync(mediaDir) : [])
  .filter((d) => !d.startsWith(".") && statSync(join(mediaDir, d)).isDirectory())
  .sort(sortFr)
  .map((slug) => {
    const dir = join(mediaDir, slug);
    const files = readdirSync(dir).filter((f) => !f.startsWith(".")).sort(sortFr);
    const videoBases = files.filter((f) => /\.mp4$/i.test(f) && !/-preview\.mp4$/i.test(f)).map((f) => parse(f).name);

    const videos = videoBases.map((base) => {
      const poster = files.find((f) => IMG.test(f) && parse(f).name === base);
      const preview = files.includes(`${base}-preview.mp4`) ? `/media/${slug}/${base}-preview.mp4` : null;
      return {
        type: "video",
        id: `${slug}/${base}`,
        src: `/media/${slug}/${base}.mp4`,
        preview,
        poster: poster ? `/media/${slug}/${poster}` : null,
        ...(poster ? sizeOf(join(dir, poster)) : { width: 1920, height: 1080 }),
      };
    });

    const photos = files
      .filter((f) => IMG.test(f) && !videoBases.includes(parse(f).name))
      .map((f) => ({
        type: "photo",
        id: `${slug}/${parse(f).name}`,
        src: `/media/${slug}/${f}`,
        ...sizeOf(join(dir, f)),
      }));

    return { slug, items: [...videos, ...photos] };
  })
  .filter((p) => p.items.length > 0);

mkdirSync(join(root, "src", "data"), { recursive: true });
writeFileSync(outFile, JSON.stringify({ projects }, null, 2) + "\n");
const count = projects.reduce((n, p) => n + p.items.length, 0);
console.log(`media.json → ${projects.length} projet(s), ${count} média(s)`);
