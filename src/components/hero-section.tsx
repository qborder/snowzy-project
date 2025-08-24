"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code2, GamepadIcon, Download, Star, Users, FolderOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [projectCount, setProjectCount] = useState<number | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    async function fetchProjectCount() {
      try {
        const response = await fetch('/api/projects')
        const projects = await response.json()
        setProjectCount(projects.length)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setProjectCount(0)
      }
    }
    fetchProjectCount()
  }, [])

  const stats = [
    { label: "Projects", value: projectCount !== null ? `${projectCount}` : "...", icon: FolderOpen },
    { label: "Downloads", value: "NIL", icon: Download },
    { label: "Stars", value: "NIL", icon: Star }
  ]

  return (
    <section className="relative pb-12 pt-16 md:pb-16 md:pt-20 lg:py-24 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1400px_900px_at_20%_-15%,hsl(var(--primary)/0.15),transparent_65%),radial-gradient(1000px_800px_at_90%_10%,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_0%,transparent,hsl(var(--primary)/0.08),transparent_50%)]" />
      </div>
      {Array.from({ length: 20 }).map((_, i) => {
        const size = 0.3 + (i % 5) * 0.2
        const baseOpacity = 0.15 + (i % 4) * 0.1
        return (
          <motion.div
            key={i}
            animate={{
              y: [0, -20 - i * 1.5, 5, 0],
              x: [0, (i % 3 - 1) * 12 + mousePosition.x * 3, 0],
              opacity: [baseOpacity, baseOpacity + 0.6, baseOpacity + 0.3, baseOpacity],
              scale: [0.7, 1.4 + (i % 3) * 0.2, 0.9, 0.7],
              rotate: [0, 180 + i * 20, 360]
            }}
            transition={{
              repeat: Infinity,
              duration: 10 + i * 2,
              ease: "easeInOut",
              delay: i * 0.3
            }}
            className="pointer-events-none absolute rounded-full blur-[0.5px]"
            style={{
              left: `${8 + (i * 5) % 85}%`,
              top: `${10 + (i * 7) % 80}%`,
              width: `${size}rem`,
              height: `${size}rem`,
              background: i % 3 === 0 
                ? `radial-gradient(circle, hsl(var(--primary)/${40 + i * 3}), transparent 70%)`
                : `linear-gradient(${i * 45}deg, hsl(var(--primary)/${25 + i * 2}), hsl(var(--primary)/${15 + i}))`
            }}
          />
        )
      })}
      
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 20, ease: "linear" },
          scale: { repeat: Infinity, duration: 4, ease: "easeInOut" }
        }}
        className="pointer-events-none absolute left-[5%] top-[10%] h-24 w-24 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-2xl"
      />
      
      <motion.div
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 25, ease: "linear" },
          scale: { repeat: Infinity, duration: 6, ease: "easeInOut" }
        }}
        className="pointer-events-none absolute right-[8%] bottom-[15%] h-32 w-32 rounded-full bg-gradient-to-l from-primary/8 to-primary/3 blur-3xl"
      />
      <div className="container mx-auto">
        <div className="grid items-center gap-6 md:grid-cols-2 overflow-visible">
          <div className="space-y-4 overflow-visible">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative mb-2"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Professional Downloads
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1], delay: 0.1 }}
              className="font-heading text-4xl font-bold tracking-tight leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block"
              >
                Ship faster
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="inline-block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
              >
                with premium
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="inline-block relative"
              >
                ready-to-use code
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="absolute -bottom-2 left-0 h-1 w-full bg-gradient-to-r from-primary to-primary/50 origin-left"
                />
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
              className="max-w-2xl text-balance leading-relaxed text-muted-foreground text-lg sm:text-xl sm:leading-8"
            >
              Skip the setup. Skip the bugs. Get professional Roblox scripts and web applications 
              that work out of the box. <span className="text-foreground font-medium">Built by developers, for developers.</span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-wrap items-center gap-6 pt-2"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Button 
                size="lg" 
                className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group" 
                asChild
              >
                <Link href="/projects" className="relative z-10">
                  <span className="relative z-10">Browse Projects</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary/30 hover:border-primary/50 hover:bg-primary/10 backdrop-blur-sm transition-all duration-300" 
                asChild
              >
                <Link href="https://youtube.com/@snowzy" target="_blank" className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded bg-red-500">
                    <div className="h-2 w-2 bg-white" style={{ clipPath: 'polygon(20% 0%, 0% 50%, 20% 100%)' }} />
                  </div>
                  Watch Tutorials
                </Link>
              </Button>
            </motion.div>
          </div>
        <div className="relative hidden md:block overflow-visible">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 1, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div aria-hidden className="absolute -inset-12 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-primary/15 to-transparent blur-3xl" />
            <div className="relative aspect-[4/3] w-full rounded-3xl border border-white/20 bg-background/40 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-primary/10">
              <div className="absolute inset-0 bg-[radial-gradient(transparent_1px,hsl(var(--background)/0.8))_1px)] [background-size:20px_20px]" />
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ 
                  background: "conic-gradient(from 0deg, transparent, hsl(var(--primary)/0.6), hsl(var(--primary)/0.2), transparent)" 
                }}
              />
              
              <motion.div
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.08, 1]
                }}
                transition={{ 
                  rotate: { repeat: Infinity, duration: 30, ease: "linear" },
                  scale: { repeat: Infinity, duration: 7, ease: "easeInOut" }
                }}
                className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/30"
              />
              
              <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-background/60 backdrop-blur-xl" />
              
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    rotate: 360,
                    scale: [0.8, 1.3, 0.8],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    rotate: { repeat: Infinity, duration: 15 + i * 2, ease: "linear" },
                    scale: { repeat: Infinity, duration: 4 + i * 0.5, ease: "easeInOut" },
                    opacity: { repeat: Infinity, duration: 3 + i * 0.3, ease: "easeInOut" }
                  }}
                  className="absolute rounded-full blur-sm"
                  style={{
                    left: `${30 + (i * 45) % 40}%`,
                    top: `${25 + (i * 35) % 50}%`,
                    width: `${1 + (i % 3) * 0.8}rem`,
                    height: `${1 + (i % 3) * 0.8}rem`,
                    background: `radial-gradient(circle, hsl(var(--primary)/${40 + i * 5}), transparent 60%)`
                  }}
                />
              ))}
              
              <motion.div
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut"
                }}
                className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/40 to-primary/20 blur-lg"
              />
              
              <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_30%,hsl(var(--primary)/0.15),transparent_70%)]" />
              
              <div className="absolute inset-x-0 bottom-0 grid place-items-center p-8">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="rounded-2xl border border-white/20 bg-background/80 backdrop-blur-xl px-6 py-3 shadow-xl shadow-primary/20"
                >
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-green-400">Live</span>
                    </div>
                    <span className="text-muted-foreground">Production Ready</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: <GamepadIcon className="h-6 w-6" />,
      title: "Roblox Scripts",
      description: "Combat systems, admin tools, and UI frameworks ready to drop into Studio.",
      highlight: "Lua + GUI"
    },
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Web Apps",
      description: "Full-stack projects with Next.js, React, and modern tooling.",
      highlight: "TypeScript"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Complete Files",
      description: "Source code, assets, and setup guides — everything to get running fast.",
      highlight: "No Setup"
    },
  ]

  return (
    <section className="relative py-16 md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(600px_400px_at_50%_0%,hsl(var(--primary)/0.08),transparent_70%)]" />
      
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
            Ready to download
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional code and assets. Copy, customize, ship.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{ hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1 } }}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl p-6 h-full">
                <div aria-hidden className="pointer-events-none absolute -inset-0.5 rounded-[inherit] bg-[conic-gradient(from_0deg,transparent,hsl(var(--primary)/0.2),transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                    </div>
                    <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-1 text-xs text-primary font-medium">
                      {feature.highlight}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
