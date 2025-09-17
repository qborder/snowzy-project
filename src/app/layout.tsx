import type { Metadata } from "next";
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Navigation from '@/components/navigation'
import MouseSpotlight from '@/components/mouse-spotlight'
import PageTransition from '@/components/page-transition'
import LoadingScreen from '@/components/loading-screen'

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Snowzy - Projects & Tutorials",
    template: "%s | Snowzy"
  },
  description: "🚀 Premium development tutorials & project downloads | 💎 Roblox scripting, web development & programming resources | 🎯 Expert-crafted content for developers",
  keywords: [
    "Roblox", "Development", "Tutorials", "Projects", "Programming", "Web Development",
    "Game Development", "Scripting", "Luau", "React", "Next.js", "TypeScript", "JavaScript"
  ],
  authors: [{ name: "Snowzy", url: "https://snowzy.vercel.app" }],
  creator: "Snowzy",
  publisher: "Snowzy",
  category: "Technology",
  classification: "Development Tutorials and Resources",
  metadataBase: new URL('https://snowzy.vercel.app'),
  alternates: {
    canonical: 'https://snowzy.vercel.app',
  },
  openGraph: {
    title: "Snowzy - Projects & Tutorials",
    description: "🚀 Premium Dev Resources | 💎 Roblox + Web Development\n📚 Expert tutorials & project downloads\n🎯 Luau scripting, React, TypeScript & more!",
    url: 'https://snowzy.vercel.app',
    siteName: 'Snowzy',
    images: [
      {
        url: '/embed-banner.png',
        width: 1200,
        height: 630,
        alt: 'Snowzy - Premium development tutorials and project resources',
        type: 'image/png',
      },
      {
        url: '/embed-banner-square.png',
        width: 400,
        height: 400,
        alt: 'Snowzy Logo',
        type: 'image/png',
      }
    ],
    locale: 'en_US',
    type: 'website',
    countryName: 'United States',
    ttl: 604800,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@snowzy_dev',
    creator: '@snowzy_dev',
    title: "Snowzy - Projects & Tutorials",
    description: "🚀 Cutting-edge tutorials & project files for developers\n📚 Roblox, Web Dev, Programming resources\n💎 Expert-crafted content",
    images: {
      url: '/embed-banner.png',
      alt: 'Snowzy - Premium development tutorials and project resources',
      width: 1200,
      height: 630,
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  other: {
    'theme-color': '#5865F2',
    'color-scheme': 'dark light',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Snowzy',
    'application-name': 'Snowzy',
    'msapplication-TileColor': '#5865F2',
    'msapplication-config': '/browserconfig.xml',
    'format-detection': 'telephone=no',
    'discord:embed_type': 'rich',
    'discord:color': '5865F2',
    'discord:image': 'https://snowzy.vercel.app/embed-banner.png',
    'discord:title': '🚀 Snowzy - Dev Resources Hub',
    'discord:description': '💎 Premium tutorials & downloads\n📚 Roblox scripting + Web dev\n🎯 Expert-crafted content',
    'discord:author': 'Snowzy',
    'discord:author_url': 'https://snowzy.vercel.app',
    'discord:provider': 'Snowzy',
    'discord:provider_url': 'https://snowzy.vercel.app',
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f0f23" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="msapplication-TileColor" content="#0f0f23" />
        <meta property="og:image:secure_url" content="https://snowzy.vercel.app/embed-banner.png" />
        <meta name="twitter:image:src" content="https://snowzy.vercel.app/embed-banner.png" />
        <meta property="article:author" content="Snowzy" />
        <meta name="generator" content="Next.js" />
        <meta name="referrer" content="origin-when-cross-origin" />
      </head>
      <body className={`${interSans.variable} ${geistMono.variable} font-sans antialiased overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LoadingScreen />
          <MouseSpotlight />
          <PageTransition>
            <div className="relative min-h-screen overflow-visible">
              <Navigation />
              <main>
                {children}
              </main>
            </div>
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
