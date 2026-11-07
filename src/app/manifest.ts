import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = process.env.PAGES_BASE_PATH || "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TaskAutoMode — everyday tasks, automated for you",
    short_name: "TaskAutoMode",
    start_url: `${base}/`,
    display: "standalone",
    background_color: "#14213D",
    theme_color: "#14213D",
    icons: [
      { src: `${base}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}/icon-512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
