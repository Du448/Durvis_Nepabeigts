import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  outputFileTracingRoot: __dirname,
  // unpdf ships ESM-only with no worker file; letting webpack trace and
  // bundle it (rather than leaving it a plain runtime require) fails to
  // resolve it inside the server actions bundle. See stockPdf.js.
  serverExternalPackages: ["unpdf"],
  images: {
    // ImageKit / Unsplash resize through their own URL parameters; see the loader.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.js",
  },
  // Photos in /public otherwise go out with max-age=0 and are revalidated on
  // every visit. File names are not content-hashed (a re-exported photo keeps
  // its name), so this is a long max-age rather than `immutable`: a replaced
  // file reaches returning visitors within 30 days, sooner via revalidation.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=31536000" }];
    return ["/_img/:path*", "/products/:path*", "/images/:path*", "/finishes/:path*", "/locks/:path*", "/scenes/:path*"].map((source) => ({
      source,
      headers: cache,
    }));
  },
  // Allow HMR/dev resources when accessed via the proxy host 127.0.0.1
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
