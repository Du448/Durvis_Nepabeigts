/* Local image pipeline for public/products and public/images.

   1. Originals wider or taller than MAX_EDGE are shrunk in place (same name,
      same format). Those files are still served as-is by CSS backgrounds,
      og:image and the few plain <img> tags, so nothing should ship at
      6000 px.
   2. Every original gets WebP copies at the WIDTHS below, written to
      public/_img/<same path without extension>-<width>.webp. The next/image
      loader (src/lib/imageLoader.js) points srcset at these, so local photos
      get the same responsive treatment as ImageKit ones without using
      Vercel's image optimisation quota.

   Incremental: a variant is only rebuilt when its source is newer, so the
   predev/prebuild hooks are quick after the first run. public/_img is
   generated output and git-ignored. Keep WIDTHS in sync with the loader. */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export const WIDTHS = [384, 640, 960, 1280, 1600];
const MAX_EDGE = 1600;
const SOURCES = ["products", "images"];
const RASTER = /\.(jpe?g|png|webp)$/i;

// libvips' file cache keeps the source open, so Windows refuses to overwrite it.
sharp.cache(false);

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const outRoot = path.join(root, "_img");

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (RASTER.test(entry.name)) yield full;
  }
}

async function mtime(file) {
  try {
    return (await fs.stat(file)).mtimeMs;
  } catch {
    return 0;
  }
}

async function shrinkOriginal(file) {
  const meta = await sharp(file).metadata();
  if (Math.max(meta.width, meta.height) <= MAX_EDGE) return false;
  const pipeline = sharp(file).rotate().resize(MAX_EDGE, MAX_EDGE, { fit: "inside" });
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") pipeline.png({ compressionLevel: 9, palette: false });
  else if (ext === ".webp") pipeline.webp({ quality: 82 });
  else pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true });
  const buf = await pipeline.toBuffer();
  await fs.writeFile(file, buf);
  return true;
}

async function buildVariants(file) {
  const rel = path.relative(root, file).replace(RASTER, "");
  const srcTime = await mtime(file);
  let built = 0;
  for (const w of WIDTHS) {
    const out = path.join(outRoot, `${rel}-${w}.webp`);
    if ((await mtime(out)) > srcTime) continue;
    await fs.mkdir(path.dirname(out), { recursive: true });
    await sharp(file).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(out);
    built++;
  }
  return built;
}

const started = Date.now();
let shrunk = 0;
let variants = 0;
let files = 0;
for (const dir of SOURCES) {
  for await (const file of walk(path.join(root, dir))) {
    files++;
    if (await shrinkOriginal(file)) shrunk++;
    variants += await buildVariants(file);
  }
}
console.log(`optimize-images: ${files} images, ${shrunk} originals shrunk, ${variants} variants written (${((Date.now() - started) / 1000).toFixed(1)} s)`);
