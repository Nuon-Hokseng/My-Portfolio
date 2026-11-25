import React from "react";
import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Noto_Sans_Khmer } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { name, altNames, email, siteUrl, profileUrls } from "@/lib/site";
import "./globals.css";
import "./refinements.css";
import "./motion.css";
import "./hero-backdrop.css";
import "./portrait-signal.css";

// One Latin family plus a Khmer subset; no decorative font download.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
});
const notoKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["700", "800"],
  variable: "--font-noto-khmer",
});

const title = `${name} | Full-Stack Web Developer in Cambodia`;
const description = `${name}, a full-stack web developer in Cambodia with 2.5 years of hands-on experience. Explore Next.js, TypeScript, NestJS projects and community work.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: name,
  keywords: [
    name,
    ...altNames,
    "Nuon Hokseng portfolio",
    "Software Engineer",
    "Full-Stack Developer",
    "Next.js",
    "TypeScript",
    "React",
    "Kirirom Institute of Technology",
    "Cambodia",
  ],
  authors: [{ name, url: siteUrl }],
  creator: name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: name,
    type: "profile",
    firstName: "Hokseng",
    lastName: "Nuon",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      {
        url: "/icons/icon-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icons/icon-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#171c1a" },
  ],
};

// Structured data so search engines know this site *is* the person, and
// which profiles belong to them (feeds the name knowledge panel).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name,
      alternateName: altNames,
      givenName: "Hokseng",
      familyName: "Nuon",
      url: siteUrl,
      image: `${siteUrl}/hero.png`,
      email: `mailto:${email}`,
      jobTitle: "Full-Stack Web Developer",
      description,
      nationality: { "@type": "Country", name: "Cambodia" },
      address: { "@type": "PostalAddress", addressCountry: "KH" },
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Kirirom Institute of Technology",
      },
      knowsAbout: [
        "Software Engineering",
        "Next.js",
        "TypeScript",
        "React",
        "Node.js",
        "NestJS",
        "Supabase",
        "PostgreSQL",
        "Docker",
        "AWS",
      ],
      sameAs: profileUrls,
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name,
      alternateName: altNames,
      inLanguage: "en",
      publisher: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: title,
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/#person` },
      dateModified: "2026-11-25T00:00:00+07:00",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${hanken.variable} ${notoKhmer.variable}`}
    >
      <head>
        {/* Set theme before paint to avoid a flash of the wrong theme.
            suppressHydrationWarning: browser extensions inject their own
            <script> tags into <head>, which React would otherwise flag. */}
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <noscript>
          <style>{`.menu,.filter-bar,.volunteer-tabs{display:none!important}@media(max-width:760px){.nav{height:auto;min-height:72px;flex-wrap:wrap;padding-block:15px}.nav-links{display:flex!important;position:static;order:3;width:100%;flex-direction:row;flex-wrap:wrap;padding:0;border:0;box-shadow:none;gap:12px}}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
        {process.env.VERCEL === "1" && <Analytics />}
      </body>
    </html>
  );
}
