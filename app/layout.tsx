import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set theme before paint to avoid a flash of the wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
