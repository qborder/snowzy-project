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
  title: "Snowzy - Projects & Tutorials",
  description: "Discover cutting-edge tutorials and download project files for Roblox development, web applications, and modern programming.",
  keywords: ["Roblox", "Development", "Tutorials", "Projects", "Programming", "Web Development"],
  authors: [{ name: "Snowzy" }],
  creator: "Snowzy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
