"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Github, Youtube, Menu, X, Sparkles, Code, Home, User } from "lucide-react"
import { SearchBar } from "@/components/search-bar"
import { ThemeToggle } from "@/components/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: Code },
    { href: "https://youtube.com/@snowzy", label: "Tutorials", icon: Youtube, external: true },
    { href: "/about", label: "About", icon: User }
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href) && href !== "/"
  }

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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/8 via-purple-500/5 to-primary/8 opacity-60" />
      <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-x-48 -translate-y-48" />
      <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/15 to-transparent rounded-full blur-2xl translate-x-32 -translate-y-32" />
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      
      <div className="container mx-auto px-4 flex h-16 items-center relative z-10">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link className="flex items-center space-x-3 group" href="/">
            <div className="hidden sm:block">
              <span className="text-2xl font-black text-primary hover:text-primary/80 transition-colors duration-300">
                Snowzy
              </span>
              <div className="text-xs text-muted-foreground font-medium -mt-1">Creative Studio</div>
            </div>
            <div className="sm:hidden">
              <span className="text-xl font-black text-primary">S</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 ml-8">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group",
                  active
                    ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 shadow-sm"
                    : "text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/20 border border-transparent"
                )}
              >
                <Icon className={cn("h-4 w-4 transition-transform duration-200", active ? "text-primary" : "group-hover:scale-110")} />
                {item.label}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary/15 to-primary/5 rounded-xl border border-primary/25"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-end space-x-3">
          <div className="hidden sm:flex items-center space-x-2">
            <SearchBar />
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="hover:scale-110 transition-all duration-200 hover:bg-primary/15 hover:text-primary border border-transparent hover:border-primary/20"
            >
              <Link href="https://youtube.com/@snowzy" target="_blank">
                <Youtube className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="hover:scale-110 transition-all duration-200 hover:bg-primary/15 hover:text-primary border border-transparent hover:border-primary/20"
            >
              <Link href="https://github.com/snowzy" target="_blank">
                <Github className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/15 hover:text-primary border border-transparent hover:border-primary/20"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <div className="sm:hidden mb-4">
                <SearchBar />
              </div>
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                      active
                        ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30"
                        : "text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 border border-transparent hover:border-primary/20"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.header>
  )
}

export default Navigation
