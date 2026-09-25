import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  outputFileTracingRoot: __dirname,
  // pdfjs-dist (weekly stock PDF parsing, src/lib/stockPdf.js) resolves its
  // worker script relative to its own file at runtime; webpack's bundling
  // breaks that path. Left external, Node resolves it normally instead.
  serverExternalPackages: ["pdfjs-dist"],
  images: {
    // ImageKit / Unsplash resize through their own URL parameters; see the loader.
    loader: "custom",
    loaderFile: "./src/lib/imageLoader.js",
  },
  // Allow HMR/dev resources when accessed via the proxy host 127.0.0.1
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
