import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: "2026-11-25",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/Nuon_Hokseng_CV.pdf`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
