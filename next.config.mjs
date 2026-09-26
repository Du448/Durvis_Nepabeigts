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
  // Allow HMR/dev resources when accessed via the proxy host 127.0.0.1
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
