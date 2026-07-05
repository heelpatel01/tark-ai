import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default: "Tark AI — Learn from AI Mentors",
    template: "%s | Tark AI",
  },
  description:
    "Chat with AI personas inspired by your favorite tech mentors. Learn coding, backend development, AI, and problem-solving through natural conversations.",
  keywords: [
    "Tark AI",
    "AI chat",
    "AI personas",
    "chat with AI",
    "chat with Hitesh Choudhary",
    "AI powered conversations",
    "tech leaders AI",
    "persona chatbot",
    "OpenSource AI",
    "chai aur code",
    "Piyush Garg",
    "conversational AI",
    "interactive AI personas",
    "AI education",
    "learn from AI",
  ],

  // Author & Creator
  authors: [{ name: "Heel Patel", url: "https://github.com/heelpatel01" }],
  creator: "Heel Patel",
  publisher: "Tark AI",

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add your verification codes when available)
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },

  // Category & Classification
  category: "technology",

  // Manifest
  manifest: "/site.webmanifest",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://tarkai.vercel.app/",
    siteName: "Tark AI",
    title: "Tark AI — Learn from AI Mentors",
    description:
      "Chat with AI personas inspired by your favorite tech mentors. Learn coding, backend development, AI, and problem-solving through natural conversations.",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Tark AI — Learn from AI Mentors",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    site: "@tarkai",
    creator: "@heelpatel01",
    title: "Tark AI — Learn from AI Mentors",
    description:
      "Chat with AI personas inspired by your favorite tech mentors. Learn coding, backend development, AI, and problem-solving through natural conversations.",
    images: {
      url: "/hero.png",
      alt: "Tark AI — Learn from AI Mentors",
    },
  },

  // Other Metadata
  metadataBase: new URL("https://tarkai.vercel.app/"),
  alternates: {
    canonical: "https://tarkai.vercel.app/",
  },

  // App-specific
  applicationName: "Tark AI",
  appleWebApp: {
    capable: true,
    title: "Tark AI",
    statusBarStyle: "black-translucent",
  },
};

// Viewport configuration (exported separately in Next.js 14+)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="transition-all duration-300" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('tarkai-theme');
                  const theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-all duration-300`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
