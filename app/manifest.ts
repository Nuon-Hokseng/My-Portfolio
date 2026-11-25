import type { MetadataRoute } from "next";
import { name } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${name} — Full-Stack Web Developer`,
    short_name: name,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#203a34",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
