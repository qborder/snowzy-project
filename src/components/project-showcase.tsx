"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Download, Github, ExternalLink } from "lucide-react"
import Link from "next/link"

const projects = [
  {
    title: "Advanced Roblox Admin System",
    description: "Complete admin system with GUI, commands, and user management for Roblox games.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/roblox-admin",
    githubUrl: "https://github.com/snowzy/roblox-admin",
    tags: ["Lua", "GUI", "Admin", "Commands"],
    gradient: "from-red-500/20 to-orange-500/20"
  },
  {
    title: "Modern Dashboard Template",
    description: "Responsive dashboard built with Next.js, TypeScript, and Tailwind CSS.",
    category: "Web Development",
    downloadUrl: "https://github.com/snowzy/dashboard-template",
    githubUrl: "https://github.com/snowzy/dashboard-template",
    demoUrl: "https://dashboard-demo.vercel.app",
    tags: ["Next.js", "TypeScript", "Dashboard", "React"],
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Roblox RPG Combat System",
    description: "Complete RPG combat system with skills, levels, and special abilities.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/rpg-combat",
    githubUrl: "https://github.com/snowzy/rpg-combat",
    tags: ["RPG", "Combat", "Skills", "Levels"],
    gradient: "from-purple-500/20 to-pink-500/20"
  },
]

export function ProjectShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
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
    const timer = setInterval(() => {
      paginate(1)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const currentProject = projects[currentIndex]

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

        <div className="relative">
          <div className="relative h-[400px] md:h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
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
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${currentProject.gradient} opacity-50`} />
                <div className="relative z-10 flex h-full flex-col justify-between p-8 md:flex-row md:items-center">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {currentProject.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {currentProject.title}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                        {currentProject.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {currentProject.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button asChild>
                        <Link href={currentProject.downloadUrl} target="_blank">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Link>
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <Link href={currentProject.githubUrl} target="_blank">
                          <Github className="h-4 w-4" />
                        </Link>
                      </Button>
                      {currentProject.demoUrl && (
                        <Button variant="outline" size="icon" asChild>
                          <Link href={currentProject.demoUrl} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur border-white/20 hover:bg-background"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur border-white/20 hover:bg-background"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex justify-center mt-6 space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1)
                  setCurrentIndex(index)
                }}
                className={`h-2 w-8 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
