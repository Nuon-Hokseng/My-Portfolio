import type { MetadataRoute } from "next";
import { name } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${name} — Software Engineer`,
    short_name: name,
    start_url: "/",
    display: "standalone",
    background_color: "#14193f",
    theme_color: "#14193f",
    icons: [{ src: "/logo.png", sizes: "any", type: "image/png" }],
  };
}
