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
        "sticky top-0 z-50 w-full border-b backdrop-blur-2xl transition-all duration-500 relative overflow-hidden",
        scrolled 
          ? "bg-background/85 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] border-white/20 shadow-primary/5" 
          : "bg-background/70 border-white/10"
      )}
    >
      {/* Enhanced Background Effects */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/12 via-purple-500/8 to-primary/12 opacity-70" />
      <motion.div 
        animate={{ 
          scale: scrolled ? [1, 1.1, 1] : [1, 1.05, 1],
          opacity: scrolled ? [0.3, 0.5, 0.3] : [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent rounded-full blur-3xl -translate-x-48 -translate-y-48" 
      />
      <motion.div
        animate={{ 
          scale: scrolled ? [1, 0.9, 1] : [1, 1.1, 1],
          opacity: scrolled ? [0.2, 0.4, 0.2] : [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-2xl translate-x-32 -translate-y-32" 
      />
      
      {/* Animated mesh gradient */}
      <motion.div
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_0%,transparent,hsl(var(--primary)/0.03),transparent_50%)] bg-[length:200%_100%]"
      />
      
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      
      <div className="container mx-auto px-4 flex h-16 items-center justify-between relative z-10 min-w-0">
        {/* Enhanced Logo Section */}
        <div className="flex items-center min-w-0">
          <Link className="flex items-center group" href="/">
            {/* Logo Icon */}
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary/20 via-primary/15 to-primary/5 border border-primary/30 backdrop-blur-sm group-hover:scale-105 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-md group-hover:shadow-primary/20">
              <Code className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Desktop Logo Text */}
            <div className="hidden sm:flex sm:flex-col sm:ml-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent group-hover:from-primary/80 group-hover:via-primary group-hover:to-primary transition-all duration-300 whitespace-nowrap">
                  Snowzy
                </span>
                <div className="px-1.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                  v2
                </div>
              </div>
              <div className="text-[10px] text-muted-foreground font-medium -mt-0.5 group-hover:text-primary/60 transition-colors duration-300 whitespace-nowrap">Creative Studio</div>
            </div>
            
            {/* Mobile Logo */}
            <div className="sm:hidden ml-2">
              <span className="text-lg font-black text-primary">S</span>
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
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden",
                  active
                    ? "bg-gradient-to-r from-primary/25 via-primary/15 to-primary/10 text-primary border border-primary/40 shadow-lg shadow-primary/20"
                    : "text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/15 hover:via-primary/8 hover:to-primary/5 hover:border-primary/25 border border-transparent hover:shadow-md hover:shadow-primary/10 hover:scale-[1.02]"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-all duration-300 relative z-10", 
                  active 
                    ? "text-primary drop-shadow-sm" 
                    : "group-hover:scale-110 group-hover:text-primary group-hover:drop-shadow-sm"
                )} />
                {item.label}
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
                
                {/* Active state indicator */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/12 to-primary/8 rounded-xl border border-primary/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                
                {/* Active pulse effect */}
                {active && (
                  <motion.div
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl"
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
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="relative overflow-hidden hover:bg-gradient-to-br hover:from-red-500/20 hover:to-red-600/10 hover:text-red-500 border border-transparent hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 group"
              >
                <Link href="https://youtube.com/@snowzy" target="_blank">
                  <Youtube className="h-4 w-4 relative z-10 group-hover:drop-shadow-sm" />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="relative overflow-hidden hover:bg-gradient-to-br hover:from-gray-500/20 hover:to-gray-600/10 hover:text-gray-300 border border-transparent hover:border-gray-500/30 hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300 group"
              >
                <Link href="https://github.com/snowzy" target="_blank">
                  <Github className="h-4 w-4 relative z-10 group-hover:drop-shadow-sm" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden relative overflow-hidden hover:bg-gradient-to-br hover:from-primary/20 hover:to-primary/10 hover:text-primary border border-transparent hover:border-primary/25 hover:shadow-md hover:shadow-primary/20 transition-all duration-300 group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </motion.div>
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
            className="md:hidden border-t border-white/15 bg-background/90 backdrop-blur-2xl shadow-2xl shadow-black/20"
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
                      "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden",
                      active
                        ? "bg-gradient-to-r from-primary/25 via-primary/15 to-primary/10 text-primary border border-primary/40 shadow-lg shadow-primary/25"
                        : "text-foreground/70 hover:text-foreground hover:bg-gradient-to-r hover:from-primary/15 hover:via-primary/8 hover:to-primary/5 border border-transparent hover:border-primary/25 hover:shadow-md hover:shadow-primary/15 hover:scale-[1.02]"
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
