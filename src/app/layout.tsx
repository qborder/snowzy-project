import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";

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
      <body className={`${interSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_20%_-10%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(1000px_700px_at_90%_10%,hsl(var(--primary)/0.06),transparent_55%)]"
            />
            <Navigation />
            <main className="flex-1">
              <div className="container mx-auto px-4">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
