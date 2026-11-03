import type { NextConfig } from "next";

// Static export for preview hosting. Switch back to a server build when Stripe API routes are added.
const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages serves the site under /taskautopilot-web; set by the deploy workflow.
  basePath: process.env.PAGES_BASE_PATH || "",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
