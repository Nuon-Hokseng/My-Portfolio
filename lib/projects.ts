// Portfolio projects, shown as tiles on the portfolio wall (components/sections/GallerySection.tsx).

export type Project = {
  slug: string;
  // screenshots shown in the details modal; hide anything customer-related or secret first
  screenshots?: { src: string; alt: string; caption: string }[];
  // "phone" screenshots are portrait app captures, shown in a phone-shaped viewer (default "wide")
  screenshotShape?: "wide" | "phone";
  title: string;
  description: string;
  // longer write-up shown in the details modal
  details?: string;
  role?: string;
  highlights?: string[];
  tags: string[];
  icon: string;
  gradient: string;
  private?: boolean;
  demo?: string;
  code?: string;
};

export const projects: Project[] = [
  {
    slug: "tilomnov",
    title: "Tilomnov — Property Marketplace",
    description:
      "A property marketplace: pin land and houses on the map, chat and call the owners, and follow people for a feed of their listings.",
    details:
      "A mobile marketplace where people pin a property directly on the map, or draw its boundary and see the area measured live, and other users can browse, save, and contact the real owner. Buyers chat with owners over end-to-end encrypted messages, call them from inside the app, and follow people to get a feed of their new listings. The Flutter app talks to a NestJS backend split into microservices behind a single API gateway.",
    role: "Full-stack developer · built with Claude as an AI assistant",
    highlights: [
      "Map-first browsing with price pins and filters, plus a boundary tool that measures each side and the total area",
      "Follow system and a feed of the people you follow, paginated with a cursor",
      "End-to-end encrypted chat over Socket.IO: the server stores only ciphertext, with a PIN-protected key backup, presence and voice messages",
      "Voice calls over WebRTC, with signalling on the chat socket and Cloudflare TURN credentials for calls between mobile networks",
      "Seven NestJS services behind one gateway; Redis for caching, rate limits and realtime fan-out between instances",
      "Push notifications through Firebase Cloud Messaging, with promotions sent from a database-backed queue that resumes after a restart",
      "Hardened sessions: rotating refresh tokens, instant sign-out of a device, signed service-to-service calls",
    ],
    tags: [
      "Flutter",
      "NestJS",
      "Microservices",
      "PostgreSQL",
      "Prisma",
      "Supabase",
      "Redis",
      "Socket.IO",
      "WebRTC",
      "Cloudflare TURN",
      "Firebase",
      "Docker",
      "Railway",
    ],
    icon: "🗺️",
    gradient: "from-emerald-500/30 to-sky-500/10",
    screenshotShape: "phone",
    screenshots: [
      {
        src: "/homescreen.jpg",
        alt: "The Tilomnov welcome screen with its logo, a login button, explore without an account, and language and theme switches",
        caption: "Welcome: log in, or explore without an account, in English or Khmer and in light or dark",
      },
      {
        src: "/tilomnov/map.jpg",
        alt: "Tilomnov map of Phnom Penh with property price pins, a search bar and type filters",
        caption: "Explore: listings as price pins on the map, with search and filters by type",
      },
      {
        src: "/tilomnov/boundary.jpg",
        alt: "Drawing a land boundary on the map with each side and the total area measured",
        caption: "Draw a boundary: drag the corners and see each side and the total area live",
      },
      {
        src: "/tilomnov/feed.jpg",
        alt: "The feed of listings from the people you follow",
        caption: "Feed: new listings from the people you follow. Names blurred",
      },
      {
        src: "/tilomnov/chat.jpg",
        alt: "The chat list with names and messages blurred",
        caption: "Chat: end-to-end encrypted conversations. Names and messages blurred",
      },
      {
        src: "/tilomnov/listings.jpg",
        alt: "My properties with status tabs and contacts, views and saves per listing",
        caption: "My listings: status tabs, photos, and contacts, views and saves per listing",
      },
      {
        src: "/tilomnov/saved.jpg",
        alt: "Saved properties in a two-column grid",
        caption: "Saved: favourite listings in one place. Another user's name blurred",
      },
    ],
  },
  // ── Private / NDA projects ──────────────────────────────────────────────
  // Source stays private; "View Details" opens a modal with the write-up.
  {
    slug: "optical-pos",
    screenshots: [
      {
        src: "/optical-pos/receipt.png",
        alt: "Premier Optic POS with an empty receipt, the product menu and the cashier selector",
        caption: "Receipts: several open at once, with auto-save, cash or KHQR, and a cashier picker",
      },
      {
        src: "/optical-pos/frames.png",
        alt: "Frame entry form and the frame catalogue grouped by brand with discounts",
        caption: "Products: add frames, lenses and accessories, grouped by brand with per-item discounts",
      },
      {
        src: "/optical-pos/prescription.png",
        alt: "Customer database with a prescription table and the items on the receipt",
        caption: "Customers: prescriptions (SPH, CYL, AXIS, PD) saved with the items bought. Phone number blurred",
      },
      {
        src: "/optical-pos/khqr.png",
        alt: "Customer-facing ABA KHQR payment screen with an expiry timer",
        caption: "Payment: a dynamic ABA KHQR code on a customer-facing screen, with an expiry timer. QR and IDs blurred",
      },
    ],
    title: "Premier Optic POS",
    description:
      "A self-hosted point-of-sale and inventory system for an optical shop, built from scratch and reachable only over a private VPN.",
    details:
      "A point-of-sale and inventory system built from scratch for an optical retail shop, as a full-stack Next.js app with Supabase as the database. Staff keep several receipts open at once, add frames, lenses, accessories and contact lenses with per-item discounts, record each customer's prescription, and take payment in cash or by a dynamic ABA KHQR code. It is self-hosted: a separate tunnel on an AWS EC2 instance, combined with WireGuard, forms a secure private network, so only people connected to the VPN can reach the POS, from the shop or anywhere else.",
    role: "Full-stack developer",
    highlights: [
      "Built end to end with Next.js full-stack and Supabase as the database",
      "Multi-receipt workspace with auto-save, cashier selection and printing",
      "Product catalogue, customer prescriptions, holding data and membership cards",
      "Dynamic ABA KHQR payments with an expiring QR code",
      "Self-hosted behind an EC2 tunnel and WireGuard VPN, so only VPN users can reach it",
    ],
    tags: ["Next.js 16", "React 19", "TypeScript", "Supabase", "PostgreSQL", "ABA KHQR", "WireGuard", "AWS EC2"],
    icon: "👓",
    gradient: "from-violet-500/30 to-purple-500/10",
    private: true,
  },
  {
    slug: "compara",
    title: "Compara — Comparison Platform",
    description:
      "A full-stack platform for browsing and comparing products, with multi-language support, authentication, and a rich component-driven UI.",
    details:
      "A full-stack web platform (team project) for browsing and comparing products. The Next.js frontend features a polished Radix UI component system, internationalization, and data visualization, backed by an Express API with MongoDB and PostgreSQL, scheduled jobs, and Clerk authentication.",
    role: "Full-stack developer · team project",
    highlights: [
      "Next.js frontend with Radix UI, i18n (next-intl), and charts",
      "Express + MongoDB / PostgreSQL REST API with Clerk auth & JWT",
      "Hardened with rate limiting, Helmet, and scheduled cron jobs",
    ],
    tags: ["Next.js", "Clerk", "Express", "MongoDB", "PostgreSQL", "next-intl"],
    icon: "⚖️",
    gradient: "from-emerald-500/30 to-teal-500/10",
    private: true,
  },
  {
    slug: "lead-gen",
    title: "Instagram Lead-Gen Automation",
    description:
      "Describe a niche and AI agents plan the search, a Playwright browser collects real public profiles, and AI scores each one against the target.",
    details:
      "A web tool built for a client for Instagram research and outreach. A user describes a niche in plain language, for example software engineers in Tokyo, and sets up a campaign with optional keywords and a quota of profiles. An AI discovery agent turns that into a search plan of hashtags, queries and seed accounts. A Playwright-driven browser, running in a connected Instagram session, then works through hashtag pages, posts and commenters to collect real profiles. A second AI agent reads each profile and scores it against the target, and the qualified ones are saved as leads. The agent keeps cycling, widening out from accounts it has already qualified, until the campaign's quota is met or the user stops it from the dashboard.",
    role: "Full-stack developer · team project",
    highlights: [
      "Two AI agents: a discovery agent that turns a niche into hashtags, search queries and seed accounts, and a qualification agent that scores each profile on a 100-point rubric with a confidence level and written reasoning",
      "Playwright automation in a real signed-in session: hashtag pages, posts, commenters and profiles, with detection of Instagram security checkpoints",
      "A long-running agent loop that scrapes, qualifies and expands from qualified accounts until the campaign quota is reached, with live run status and a stop button",
      "A feedback loop that records which hashtags and seed accounts produced qualified leads and feeds the best ones into the next plan",
      "Instagram accounts connected through a Chrome extension or a guided login with two-factor support; campaigns and saved leads stored in Supabase",
      "FastAPI backend with background tasks, and a Next.js dashboard in English and Japanese",
    ],
    tags: [
      "Python",
      "Playwright",
      "FastAPI",
      "OpenAI",
      "Supabase",
      "Next.js 16",
      "React 19",
      "Chrome Extension",
      "Docker",
    ],
    icon: "🤖",
    gradient: "from-fuchsia-500/30 to-pink-500/10",
    screenshots: [
      {
        src: "/lead-gen/campaigns.png",
        alt: "The Campaigns page with a form for the campaign name, target niche, optional keywords and maximum profiles per run",
        caption: "Campaigns: describe the target niche, add optional keywords, and set how many profiles to find per run",
      },
      {
        src: "/lead-gen/dashboard.png",
        alt: "The dashboard with quick actions to add an Instagram account and run the pipeline",
        caption: "Dashboard: connected Instagram sessions, quick actions and the status of the backend. Server address blurred",
      },
    ],
    private: true,
  },
  {
    slug: "meal-tracker",
    title: "KIT Meal Tracker",
    description:
      "A meal-management app that tracks daily meals and syncs data through the Google Sheets API.",
    details:
      "A meal-tracking application that records and manages daily meals, using Google Sheets as a lightweight backend through the Google APIs. Built with Next.js and SWR for fast, reactive data fetching and caching.",
    role: "Developer",
    highlights: [
      "Google Sheets API integration as a zero-cost data store",
      "Reactive data fetching and caching with SWR",
      "Clean, responsive Next.js + Tailwind UI",
    ],
    tags: ["Next.js", "Google Sheets API", "SWR", "TypeScript"],
    icon: "🍽️",
    gradient: "from-amber-500/30 to-yellow-500/10",
    private: true,
  },
  {
    slug: "sme-valuation",
    title: "SME Business Valuation Tool",
    description:
      "A Japanese-language web tool that values a small company in minutes: AI reads its financial statements, fixed formulas value it, and AI writes the analysis.",
    details:
      "A web service built for a Japanese client to give small and medium companies a quick, reference valuation for M&A and business succession. The owner enters three years of financial figures, by pasting text or uploading a PDF, image or CSV. AI reads them, the owner confirms and corrects the numbers, and the tool returns three valuations, an AI-written analysis with charts, and a printable report. I built the baseline of the project; it is no longer maintained by me.",
    role: "Full-stack developer · built the initial version (team project)",
    highlights: [
      "AI extraction of figures from pasted text, PDF, image or CSV, normalising Japanese units such as 万円 and 億円, with a confirmation step so a person checks every number",
      "Three valuations from fixed, testable formulas: adjusted net assets in three scenarios, EBITDA × an industry multiple, and an M&A estimate driven by a slider-based adjustment score",
      "AI insights in Japanese: strengths, weaknesses and value-up ideas backed by numbers, a social-impact summary, charts, and a side-by-side comparison of two companies",
      "Users can bring their own OpenAI key, sent per request and never stored; the original statement is not kept on the server",
      "Supabase Auth with admin approval, one active device per account, and row-level security so users only see their own saved evaluations",
      "FastAPI backend and Next.js frontend, with Docker, Terraform modules and GitHub Actions pipelines",
    ],
    tags: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "FastAPI",
      "Python",
      "Supabase",
      "PostgreSQL",
      "OpenAI",
      "Recharts",
      "Docker",
      "Terraform",
      "GitHub Actions",
    ],
    icon: "📊",
    gradient: "from-sky-500/30 to-indigo-500/10",
    screenshots: [
      {
        src: "/valuation/input.png",
        alt: "The valuation tool's first step: company name, industry and a box to paste or upload financial statements",
        caption: "Step 1 of 3: enter the company, its industry and three years of financial statements",
      },
    ],
    private: true,
  },
];
