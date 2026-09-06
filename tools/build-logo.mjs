/* Turns the brand logo artwork (flat navy/grey on a white JPEG) into the
   transparent assets the site uses.
     public/logo.png             colour mark + wordmark, for light backgrounds
     public/logo-white.png       same shapes in white, for the dark header/footer
     src/app/icon.png            the monogram alone, square, as the favicon
     src/app/favicon.ico         the same monogram for browsers that ask for .ico
     src/app/apple-icon.png      home-screen icon, needs an opaque background
     src/app/opengraph-image.png the link-preview card
   The source is a JPEG, so edges carry compression ringing: alpha ramps
   between the two thresholds below and the colour is un-composited from
   white, which keeps the edges smooth instead of crunchy.

   Run: node tools/build-logo.mjs <path-to-artwork>
*/
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2] || path.join(import.meta.dirname, "logo-source.jpg");
const ROOT = path.join(import.meta.dirname, "..");

const ALPHA_LO = 10;   // below this the pixel is paper, not ink
const ALPHA_HI = 45;   // above this the pixel is solid ink
const PAD = 12;

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

/* RGBA, alpha from how far the pixel sits from white. */
const rgba = Buffer.alloc(W * H * 4);
for (let p = 0; p < W * H; p++) {
  const i = p * C;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const d = 255 - Math.min(r, g, b);
  const a = Math.max(0, Math.min(1, (d - ALPHA_LO) / (ALPHA_HI - ALPHA_LO)));
  const o = p * 4;
  if (a <= 0) { rgba[o + 3] = 0; continue; }
  /* Undo the composite over white so half-covered edge pixels keep the ink's
     own colour instead of a washed-out version of it. */
  const un = (c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a)));
  rgba[o] = un(r); rgba[o + 1] = un(g); rgba[o + 2] = un(b); rgba[o + 3] = Math.round(a * 255);
}

const base = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
const box = await base.clone().trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
const { info: t } = box;
console.log("trimmed to", t.width + "x" + t.height);

const pad = (buf) =>
  sharp(buf, { raw: { width: t.width, height: t.height, channels: 4 } })
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } });

await pad(box.data).png().toFile(path.join(ROOT, "public/logo.png"));

/* White variant: keep the shapes, repaint the ink. */
const white = Buffer.from(box.data);
for (let p = 0; p < t.width * t.height; p++) {
  const o = p * 4;
  if (white[o + 3] === 0) continue;
  white[o] = 255; white[o + 1] = 255; white[o + 2] = 255;
}
await pad(white).png().toFile(path.join(ROOT, "public/logo-white.png"));

/* Favicon: the monogram on its own, centred in a square. */
const MARK = { left: 150, top: 147, width: 291, height: 457 };
const mark = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract(MARK)
  .resize({ height: 448, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: mark, gravity: "center" }])
  .png()
  .toFile(path.join(ROOT, "src/app/icon.png"));

/* Apple wants an opaque icon; a transparent one gets a black backdrop. */
await sharp({ create: { width: 180, height: 180, channels: 4, background: "#ffffff" } })
  .composite([{ input: await sharp(mark).resize({ height: 132, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), gravity: "center" }])
  .png()
  .toFile(path.join(ROOT, "src/app/apple-icon.png"));

/* .ico, so browsers asking for /favicon.ico get the brand and not the
   framework's starter icon. Every entry is a PNG, which .ico has allowed
   since Vista and every browser we care about reads. */
const sizes = [16, 32, 48, 256];
const pngs = [];
for (const s of sizes) {
  pngs.push(
    await sharp({ create: { width: s, height: s, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: await sharp(mark).resize({ height: Math.round(s * 0.88), fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), gravity: "center" }])
      .png()
      .toBuffer()
  );
}
const dir = Buffer.alloc(6 + 16 * sizes.length);
dir.writeUInt16LE(0, 0);
dir.writeUInt16LE(1, 2);
dir.writeUInt16LE(sizes.length, 4);
let offset = dir.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  dir.writeUInt8(s >= 256 ? 0 : s, e);
  dir.writeUInt8(s >= 256 ? 0 : s, e + 1);
  dir.writeUInt16LE(1, e + 4);
  dir.writeUInt16LE(32, e + 6);
  dir.writeUInt32LE(pngs[i].length, e + 8);
  dir.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
fs.writeFileSync(path.join(ROOT, "src/app/favicon.ico"), Buffer.concat([dir, ...pngs]));

/* Link-preview card: the full logo on the brand's paper white. */
await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#ffffff" } })
  .composite([{ input: await pad(box.data).resize({ width: 760, fit: "inside" }).png().toBuffer(), gravity: "center" }])
  .png()
  .toFile(path.join(ROOT, "src/app/opengraph-image.png"));

console.log("wrote logo.png, logo-white.png, icon.png, apple-icon.png, favicon.ico, opengraph-image.png");
