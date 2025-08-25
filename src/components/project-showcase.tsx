"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Download, Github, ExternalLink } from "lucide-react"
import Link from "next/link"

type Project = {
  title: string
  description: string
  category: string
  downloadUrl?: string
  githubUrl?: string
  demoUrl?: string
  youtubeUrl?: string
  image?: string
  icon?: string
  tags: string[]
}

const gradients = [
  "from-red-500/20 to-orange-500/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-purple-500/20 to-pink-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-yellow-500/20 to-orange-500/20",
  "from-indigo-500/20 to-purple-500/20"
]

export function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects')
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setProjects(data.slice(0, 6))
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15,
      filter: "blur(4px)"
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)"
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 400 : -400,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 15 : -15,
      filter: "blur(4px)"
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      if (newDirection === 1) {
        return prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      } else {
        return prevIndex === 0 ? projects.length - 1 : prevIndex - 1
      }
    })
  }

  useEffect(() => {
    if (projects.length === 0) return
    
    const timer = setInterval(() => {
      paginate(1)
    }, 5000)

    return () => clearInterval(timer)
  }, [projects.length])

  if (loading) {
    return (
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(800px_600px_at_50%_0%,hsl(var(--primary)/0.06),transparent_70%)]" />
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              Latest builds
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fresh projects with source code you can grab and customize.
            </p>
          </div>
          <div className="relative h-[400px] md:h-[300px] rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl animate-pulse" />
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(800px_600px_at_50%_0%,hsl(var(--primary)/0.06),transparent_70%)]" />
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
              Latest builds
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fresh projects with source code you can grab and customize.
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-muted-foreground">No projects available</p>
          </div>
        </div>
      </section>
    )
  }

  const currentProject = projects[currentIndex]
  const currentGradient = gradients[currentIndex % gradients.length]

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(800px_600px_at_50%_0%,hsl(var(--primary)/0.06),transparent_70%)]" />
      
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
            Latest builds
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fresh projects with source code you can grab and customize.
          </p>
        </motion.div>

        <div className="relative [perspective:1200px]">
          <div className="relative h-[400px] md:h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] [transform-style:preserve-3d]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 180, damping: 22, mass: 0.8 },
                  opacity: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                  scale: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                  rotateY: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
                  filter: { duration: 0.3, ease: "easeOut" }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x)

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1)
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1)
                  }
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing [transform-style:preserve-3d]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient} opacity-60`} />
                <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_30%_40%,rgba(255,255,255,0.1),transparent_70%)]" />
                <div className="relative z-10 flex h-full flex-col justify-center p-6 md:p-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-white/15 text-white border-white/25 backdrop-blur-sm px-3 py-1.5 text-sm font-medium">
                        {currentProject.category}
                      </Badge>
                      <div className="h-1 w-1 rounded-full bg-white/40" />
                      <span className="text-white/70 text-sm font-medium">
                        {currentProject.tags.length} {currentProject.tags.length === 1 ? 'tag' : 'tags'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        {currentProject.title}
                      </h3>
                      <p className="text-white/90 text-base md:text-lg leading-relaxed line-clamp-2">
                        {currentProject.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {currentProject.tags.slice(0, 5).map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-white/15 border border-white/25 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white/95 hover:bg-white/20 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                      {currentProject.tags.length > 5 && (
                        <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-sm text-white/70">
                          +{currentProject.tags.length - 5}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {currentProject.downloadUrl && (
                        <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-lg" asChild>
                          <Link href={currentProject.downloadUrl} target="_blank">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Link>
                        </Button>
                      )}
                      {currentProject.githubUrl && (
                        <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm" asChild>
                          <Link href={currentProject.githubUrl} target="_blank">
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                          </Link>
                        </Button>
                      )}
                      {currentProject.demoUrl && (
                        <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm" asChild>
                          <Link href={currentProject.demoUrl} target="_blank">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live Demo
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.button
            onClick={() => paginate(-1)}
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/90 backdrop-blur-md border border-white/30 shadow-lg hover:bg-background hover:border-white/40 transition-all duration-200 flex items-center justify-center group"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </motion.button>
          
          <motion.button
            onClick={() => paginate(1)}
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/90 backdrop-blur-md border border-white/30 shadow-lg hover:bg-background hover:border-white/40 transition-all duration-200 flex items-center justify-center group"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </motion.button>

          <div className="flex justify-center mt-8 space-x-3">
            {projects.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.6)]' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
