/* next/image loader (images.loaderFile). Photos hosted on ImageKit and
   Unsplash are resized and re-encoded by those CDNs through URL parameters, so
   every <Image> gets a srcset of properly sized AVIF/WebP files without using
   Vercel's image optimisation quota. Photos in public/products and
   public/images get the same from WebP copies pre-built at fixed widths by
   tools/optimize-images.mjs (public/_img). Anything else is marked
   `unoptimized` at the call site via imageProps() and never reaches this
   function. */

import { localVariant } from "./images";

export default function imageLoader({ src, width, quality }) {
  const q = quality || 75;
  if (src.startsWith("https://ik.imagekit.io/")) {
    const url = new URL(src);
    url.searchParams.set("tr", `w-${width},q-${q}`);
    return url.toString();
  }
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(q));
    url.searchParams.set("auto", "format");
    return url.toString();
  }
  return localVariant(src, width) ?? src;
}
