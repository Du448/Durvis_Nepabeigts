#!/usr/bin/env node
/* Generates the interior photography for the homepage 50/50 blocks.

   For every scene in tools/scenes.config.mjs it pulls the anchor product's
   catalogue render out of src/data/products.js, hands it to the media-gen
   skill as a reference image, and writes the result to public/scenes/<slug>.webp
   — the path src/app/page.js reads. Re-running overwrites in place, so the
   homepage never points at a missing file.

   Usage:
     node tools/generate-scene-images.mjs                # all scenes
     node tools/generate-scene-images.mjs ieksdurvis     # one or more slugs
     node tools/generate-scene-images.mjs --dry-run      # show prompts only
*/

import { spawnSync } from "node:child_process";
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { scenes } from "./scenes.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "scenes");
const WORK_DIR = path.join(tmpdir(), "durvis-scenes");
const SKILL_DIR = path.join(
  process.env.USERPROFILE || process.env.HOME,
  ".claude", "skills", "media-gen"
);
const SKILL = path.join(SKILL_DIR, "scripts", "generate.py");
/* Local antivirus (AVG) terminates TLS with its own root, which Python does
   not trust, so uploads die on CERTIFICATE_VERIFY_FAILED. If a combined
   certifi + local-root bundle has been prepared next to the skill, point the
   child process at it rather than weakening verification. */
const CA_BUNDLE = path.join(SKILL_DIR, "ca-bundle.pem");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const only = args.filter((a) => !a.startsWith("--"));

/* The catalogue is an ES module with extensionless imports, so it cannot be
   imported from a plain node script — read the source and pick the entry out
   of the JSON-shaped literals instead. */
function anchorImageUrl(productId) {
  const src = readFileSync(path.join(ROOT, "src", "data", "products.js"), "utf8");
  const at = src.indexOf(`"id": "${productId}"`);
  if (at === -1) throw new Error(`product id not found in products.js: ${productId}`);
  const imagesAt = src.indexOf('"images"', at);
  const m = /"images":\s*\[\s*"([^"]+)"/.exec(src.slice(imagesAt, imagesAt + 4000));
  if (!m) throw new Error(`no images[] for product: ${productId}`);
  return m[1];
}

async function downloadAnchor(url, slug) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`anchor download failed (${res.status}): ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const file = path.join(WORK_DIR, `anchor-${slug}.png`);
  /* Normalise to a modest PNG: the reference only has to carry the design,
     and small uploads keep the Fal request well under its 10 MB limit.
     Catalogue renders for interior doors are only ~270px wide, so short sides
     are enlarged rather than left tiny — the model reads panel detail better
     from a larger reference. */
  const { width = 0 } = await sharp(buf).metadata();
  const target = width < 900 ? 900 : Math.min(width, 1200);
  await sharp(buf)
    .resize({ width: target, kernel: sharp.kernel.lanczos3 })
    .png()
    .toFile(file);
  return file;
}

function runGenerator(scene, anchorFile) {
  const cmd = [
    "image",
    "--prompt", scene.prompt,
    "--title", `durvis-${scene.slug}`,
    "--aspect-ratio", "4:3",
    "--resolution", "2K",
  ];
  if (anchorFile) {
    cmd.push("--model", "nano-banana-pro-edit", "--input-image", anchorFile);
  }
  const env = { ...process.env };
  if (!env.SSL_CERT_FILE && existsSync(CA_BUNDLE)) env.SSL_CERT_FILE = CA_BUNDLE;
  const r = spawnSync("python", [SKILL, ...cmd], { encoding: "utf8", env });
  if (r.status !== 0) throw new Error(r.stderr || `generate.py exited ${r.status}`);
  const line = r.stdout.trim().split("\n").filter(Boolean).pop();
  return JSON.parse(line);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(WORK_DIR, { recursive: true });

  const todo = scenes.filter((s) => !only.length || only.includes(s.slug));
  if (!todo.length) {
    console.error(`no scenes matched: ${only.join(", ")}`);
    process.exit(1);
  }

  for (const scene of todo) {
    const anchorUrl = scene.anchor ? anchorImageUrl(scene.anchor) : null;
    console.log(`\n=== ${scene.slug} ===`);
    console.log(`anchor: ${scene.anchor ? `${scene.anchor} -> ${anchorUrl}` : "(none, text-to-image)"}`);
    console.log(`prompt: ${scene.prompt}`);
    if (dryRun) continue;

    if (!existsSync(SKILL)) throw new Error(`media-gen script missing: ${SKILL}`);
    const anchorFile = anchorUrl ? await downloadAnchor(anchorUrl, scene.slug) : null;
    const result = runGenerator(scene, anchorFile);

    const dest = path.join(OUT_DIR, `${scene.slug}.webp`);
    await sharp(result.image_path)
      .resize({ width: 1800, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(dest);
    console.log(`saved: public/scenes/${scene.slug}.webp  (raw: ${result.image_path})`);
  }
}

main().catch((err) => {
  console.error(String(err.message || err));
  process.exit(1);
});
