"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Github, Youtube } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion } from "framer-motion"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-all duration-500 relative overflow-hidden",
        scrolled ? "bg-background/80 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.4)] border-white/15" : "bg-background/60 border-white/8"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <div className="container mx-auto px-4 flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">Snowzy</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              className="relative transition-all duration-300 hover:text-foreground/90 text-foreground/60 hover:scale-105 group"
              href="/projects"
            >
              Projects
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              className="relative transition-all duration-300 hover:text-foreground/90 text-foreground/60 hover:scale-105 group"
              href="https://youtube.com/@snowzy"
              target="_blank"
            >
              Tutorials
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              className="relative transition-all duration-300 hover:text-foreground/90 text-foreground/60 hover:scale-105 group"
              href="/about"
            >
              About
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center space-x-2">
              <SearchBar />
              <ThemeToggle />
              <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform duration-200 hover:bg-primary/10">
                <Link href="https://youtube.com/@snowzy" target="_blank">
                  <Youtube className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform duration-200 hover:bg-primary/10">
                <Link href="https://github.com/snowzy" target="_blank">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </motion.header>
  )
}

export default Navigation
