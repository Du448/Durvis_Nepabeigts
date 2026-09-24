/* Which image sources the loader in @/lib/imageLoader can resize. Everything
   else - the manufacturer's own site, files in /public - is passed through
   untouched, so it is flagged `unoptimized` rather than given a srcset of
   identical URLs. Spread the result into <Image>: {...imageProps(src)}. */

const RESIZABLE = ["https://ik.imagekit.io/", "https://images.unsplash.com/"];

export const isResizable = (src) => typeof src === "string" && RESIZABLE.some((p) => src.startsWith(p));

export const imageProps = (src) => (isResizable(src) ? {} : { unoptimized: true });

/* A fixed-width ImageKit/Unsplash URL, for places that need a plain URL
   (CSS backgrounds, og:image, JSON-LD) rather than an <Image>. */
export function sizedImage(src, width, quality = 75) {
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
