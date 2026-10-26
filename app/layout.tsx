import React from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, Noto_Sans_Khmer } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { name, khmerName, altNames, email, siteUrl, profileUrls } from "@/lib/site";
import "./globals.css";

// display: condensed via the wdth axis; body: Hanken; Khmer script: Noto
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
});
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
const notoKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  weight: ["700", "800"],
  variable: "--font-noto-khmer",
});

const title = `${name} (${khmerName}) — Full-Stack Software Engineer`;
const description = `${name} is a full-stack software engineer from Cambodia, studying at Kirirom Institute of Technology. Portfolio of Next.js, TypeScript and React projects — open to new opportunities.`;

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
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
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
    icon: [{ url: "/logo.png" }],
    apple: [{ url: "/logo.png" }],
  },
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
      jobTitle: "Full-Stack Software Engineer",
      description,
      nationality: { "@type": "Country", name: "Cambodia" },
      address: { "@type": "PostalAddress", addressCountry: "KH" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Kirirom Institute of Technology" },
      knowsAbout: ["Software Engineering", "Next.js", "TypeScript", "React", "Node.js", "NestJS", "Supabase", "PostgreSQL", "Docker", "AWS"],
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
      className={`${bricolage.variable} ${hanken.variable} ${notoKhmer.variable}`}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
