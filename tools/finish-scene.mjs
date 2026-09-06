#!/usr/bin/env node
/* Turns a raw Canva scene export into the file the homepage serves.

   Canva can composite the real product render into a generated room, but its
   shapes have no blur, so a door pasted in that way has no shadow and reads as
   a sticker. This script paints the missing light: a contact shadow where the
   leaf meets the floor, a cast shadow on the wall away from the light, and a
   tight ambient line around the reveal. Then it centre-crops to 4:3 to match
   `.split-media` and writes the webp.

   Door rectangles live in tools/scenes.config.mjs in Canva page coordinates
   (1920x1080); everything here is scaled from those.

   Usage: node tools/finish-scene.mjs <raw-export.jpg> <scene-slug>
*/

import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { scenes } from "./scenes.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CANVA_PAGE_WIDTH = 1920;
const OUT_WIDTH = 1400;

/* Shadow strengths, tuned by eye against the three rooms. Keep them low —
   the giveaway of a fake shadow is that it is darker than the room's own. */
const CAST_OPACITY = 0.3;
const CONTACT_OPACITY = 0.5;
const REVEAL_OPACITY = 0.32;
const FLOOR_OPACITY = 0.22;

function shadowSvg({ width, height, door, light }) {
  const { left, top, width: dw, height: dh } = door;
  const right = left + dw;
  const bottom = top + dh;
  /* The cast shadow falls away from the light, so it hugs the far jamb. */
  const castX = light === "left" ? right - 4 : left - 30;
  /* The floor catches a wider, softer pool on the same side. */
  const floorX = light === "left" ? right - dw * 0.35 : left - dw * 0.35;

  const layer = (blur, body) =>
    `<g filter="url(#blur${blur})">${body}</g>`;

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    ${[18, 13, 10, 5].map((b) => `<filter id="blur${b}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${b}"/></filter>`).join("")}
  </defs>
  ${layer(18, `<rect x="${floorX}" y="${bottom - 10}" width="${dw * 0.7}" height="46" fill="#000" opacity="${FLOOR_OPACITY}"/>`)}
  ${layer(13, `<rect x="${castX}" y="${top + 10}" width="34" height="${dh - 4}" fill="#000" opacity="${CAST_OPACITY}"/>`)}
  ${layer(10, `<rect x="${left - 12}" y="${bottom - 6}" width="${dw + 26}" height="20" fill="#000" opacity="${CONTACT_OPACITY}"/>`)}
  ${layer(5, `<rect x="${left - 5}" y="${top - 4}" width="6" height="${dh + 6}" fill="#000" opacity="${REVEAL_OPACITY}"/>
              <rect x="${right - 1}" y="${top - 4}" width="6" height="${dh + 6}" fill="#000" opacity="${REVEAL_OPACITY}"/>
              <rect x="${left - 5}" y="${top - 5}" width="${dw + 11}" height="6" fill="#000" opacity="${REVEAL_OPACITY}"/>`)}
</svg>`);
}

async function main() {
  const [rawPath, slug] = process.argv.slice(2);
  if (!rawPath || !slug) {
    console.error("usage: node tools/finish-scene.mjs <raw-export.jpg> <scene-slug>");
    process.exit(1);
  }
  const scene = scenes.find((s) => s.slug === slug);
  if (!scene) throw new Error(`unknown scene slug: ${slug}`);

  const base = sharp(rawPath);
  const { width, height } = await base.metadata();

  let composed = base;
  if (scene.door) {
    /* The export is a uniform scale of the Canva page, so one factor maps
       both axes. */
    const k = width / CANVA_PAGE_WIDTH;
    const door = {
      left: scene.door.left * k,
      top: scene.door.top * k,
      width: scene.door.width * k,
      height: scene.door.height * k,
    };
    const svg = shadowSvg({ width, height, door, light: scene.light ?? "left" });
    composed = sharp(await base.composite([{ input: svg, top: 0, left: 0 }]).jpeg({ quality: 95 }).toBuffer());
  }

  const cropWidth = Math.round(height * 4 / 3);
  const dest = path.join(ROOT, "public", "scenes", `${slug}.webp`);
  const info = await composed
    .extract({ left: Math.round((width - cropWidth) / 2), top: 0, width: cropWidth, height })
    .resize({ width: OUT_WIDTH, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(dest);
  console.log(`${slug}: ${info.width}x${info.height}, ${info.size} bytes -> public/scenes/${slug}.webp`);
}

main().catch((err) => {
  console.error(String(err.message || err));
  process.exit(1);
});
