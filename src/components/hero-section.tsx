"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Code2, GamepadIcon, Download } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative pb-6 pt-8 md:pb-8 md:pt-12 lg:py-16">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_800px_at_10%_-10%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(900px_700px_at_100%_0%,hsl(var(--primary)/0.08),transparent_55%)]" />
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -15 - i * 2, 0],
            x: [0, (i % 3 - 1) * 8, 0],
            opacity: [0.2 + i * 0.05, 0.8 + i * 0.02, 0.2 + i * 0.05],
            scale: [0.8, 1.2 + i * 0.1, 0.8]
          }}
          transition={{
            repeat: Infinity,
            duration: 8 + i * 1.5,
            ease: "easeInOut",
            delay: i * 0.8
          }}
          className={`pointer-events-none absolute rounded-full bg-primary/${30 + i * 5} blur-sm`}
          style={{
            left: `${10 + (i * 7) % 80}%`,
            top: `${15 + (i * 11) % 70}%`,
            width: `${0.5 + (i % 4) * 0.3}rem`,
            height: `${0.5 + (i % 4) * 0.3}rem`
          }}
        />
      ))}
      
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
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-heading text-3xl font-semibold tracking-tight leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block"
              >
                Download
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              >
                ready-to-use
              </motion.span>{" "}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="inline-block"
              >
                projects and files
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              className="max-w-prose text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
            >
              Clean, professional downloads for Roblox and web dev. No fluff. Just the files and steps you need to ship.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button size="lg" asChild>
                <Link href="/projects">
                  Browse downloads
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="https://youtube.com/@snowzy" target="_blank">
                  YouTube
                </Link>
              </Button>
            </motion.div>
          </div>
        <div className="relative hidden md:block overflow-visible">
          <div aria-hidden className="absolute -inset-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl" />
          <div className="relative aspect-[4/3] w-full rounded-2xl border border-white/10 bg-background/60 backdrop-blur-xl overflow-visible">
            <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(transparent_1px,hsl(var(--background))_1px)] [background-size:16px_16px]" />
            <motion.div
              initial={{ opacity: 0.7 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
              className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "conic-gradient(from 0deg, hsl(var(--primary)/0.0), hsl(var(--primary)/0.7), hsl(var(--primary)/0.0))" }}
            />
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ 
                rotate: -360,
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { repeat: Infinity, duration: 28, ease: "linear" },
                scale: { repeat: Infinity, duration: 6, ease: "easeInOut" }
              }}
              className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
            />
            <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-background/50 backdrop-blur" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
              className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-xl"
            />
            <motion.div
              initial={{ x: -60, y: -40 }}
              animate={{ x: [ -60, 60, -40, -60 ], y: [ -40, -20, 40, -40 ] }}
              transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
              className="absolute left-[15%] top-[18%] h-28 w-28 rounded-full bg-primary/25 blur-2xl"
            />
            <motion.div
              initial={{ x: 40, y: 20 }}
              animate={{ x: [ 40, -40, 60, 40 ], y: [ 20, 50, -30, 20 ] }}
              transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
              className="absolute right-[12%] bottom-[12%] h-32 w-32 rounded-full bg-primary/20 blur-3xl"
            />
            <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_30%,hsl(var(--primary)/0.12),transparent_60%)]" />
            <div className="absolute inset-x-0 bottom-0 grid place-items-center p-6 text-center text-xs text-muted-foreground overflow-visible">
              <div className="rounded-full border border-white/10 bg-background/70 px-3 py-1 shadow-[0_0_20px_hsl(var(--primary)/0.3)]">Professional downloads</div>
            </div>
          </div>
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
