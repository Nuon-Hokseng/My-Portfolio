import React from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, Noto_Sans_Khmer } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://nuonhokseng.vercel.app"),
  title: "Nuon Hokseng — Software Engineer",
  description:
    "Full-stack software engineer specializing in Next.js, TypeScript, and scalable web apps. Building real products — and open to new opportunities.",
  keywords: [
    "Nuon Hokseng",
    "Software Engineer",
    "Full-Stack Developer",
    "Next.js",
    "TypeScript",
    "React",
    "Cambodia",
    "Portfolio",
  ],
  authors: [{ name: "Nuon Hokseng" }],
  creator: "Nuon Hokseng",
  openGraph: {
    title: "Nuon Hokseng — Software Engineer",
    description:
      "Full-stack software engineer specializing in Next.js, TypeScript, and scalable web apps. Open to new opportunities.",
    url: "https://nuonhokseng.vercel.app",
    siteName: "Nuon Hokseng",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nuon Hokseng — Software Engineer",
    description:
      "Full-stack software engineer specializing in Next.js, TypeScript, and scalable web apps.",
  },
  icons: {
    icon: [{ url: "/logo.png" }],
  },
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
