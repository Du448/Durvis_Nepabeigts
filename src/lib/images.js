/* Which image sources the loader in @/lib/imageLoader can resize. Everything
   else - the manufacturer's own site, other files in /public - is passed
   through untouched, so it is flagged `unoptimized` rather than given a
   srcset of identical URLs. Spread the result into <Image>: {...imageProps(src)}. */

const RESIZABLE = ["https://ik.imagekit.io/", "https://images.unsplash.com/"];

/* public/products and public/images are pre-resized to WebP at these widths by
   tools/optimize-images.mjs - keep the two lists in sync. */
const LOCAL_WIDTHS = [384, 640, 960, 1280, 1600];
const LOCAL = /^\/(products|images)\/.+\.(jpe?g|png|webp)$/i;

const isLocal = (src) => typeof src === "string" && LOCAL.test(src);

export const isResizable = (src) => typeof src === "string" && (RESIZABLE.some((p) => src.startsWith(p)) || isLocal(src));

export const imageProps = (src) => (isResizable(src) ? {} : { unoptimized: true });

/* The pre-built WebP copy of a local photo closest to (and not under) `width`,
   or null when `src` is not one of those photos. */
export function localVariant(src, width) {
  if (!isLocal(src)) return null;
  const w = LOCAL_WIDTHS.find((lw) => lw >= width) ?? LOCAL_WIDTHS[LOCAL_WIDTHS.length - 1];
  return `/_img${src.replace(/\.[^.]+$/, "")}-${w}.webp`;
}

/* A fixed-width ImageKit/Unsplash URL, for places that need a plain URL
   (CSS backgrounds, og:image, JSON-LD) rather than an <Image>. */
export function sizedImage(src, width, quality = 75) {
  if (isLocal(src)) return localVariant(src, width);
  if (!isResizable(src)) return src;
  const url = new URL(src);
  if (src.startsWith("https://ik.imagekit.io/")) url.searchParams.set("tr", `w-${width},q-${quality}`);
  else {
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality));
    url.searchParams.set("auto", "format");
  }
  return url.toString();
}
