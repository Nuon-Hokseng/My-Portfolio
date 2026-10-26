// Single source for identity details used by the page, metadata and JSON-LD.
export const siteUrl = "https://nuonhokseng.vercel.app";

export const name = "Nuon Hokseng";
export const khmerName = "នួន ហុកសេង";
// spellings people actually type into a search box
export const altNames = ["Nuon Hok Seng", "Nuon HokSeng", "Hokseng Nuon", "Hok Seng Nuon", khmerName];

export const email = "sengnoname168@gmail.com";

export const socials = [
  { label: "Email", href: `mailto:${email}` },
  { label: "GitHub", href: "https://github.com/Nuon-Hokseng" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nuon-hokseng-b5b65b33b/" },
  { label: "Facebook", href: "https://web.facebook.com/Seng.kisuke/" },
  { label: "Telegram", href: "https://t.me/sengkennedy" },
];

// profile URLs only (no mailto) — Google uses these to tie the profiles to this site
export const profileUrls = socials.map((s) => s.href).filter((h) => h.startsWith("https://"));
