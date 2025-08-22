"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { Search, Filter, Grid3x3, LayoutList, Clock, Sparkles, Gamepad2, Code, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Project = {
  id?: string
  title: string
  description: string
  category: string
  downloadUrl?: string
  githubUrl?: string
  demoUrl?: string
  youtubeUrl?: string
  image?: string
  tags: string[]
  createdAt?: string
  cardGradient?: string
  cardColor?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [category, setCategory] = useState<string | "all">("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [layout, setLayout] = useState<"gallery" | "list">("gallery")
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects')
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        setProjects(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>(["all"]) 
    projects.forEach(p => set.add(p.category))
    return Array.from(set)
  }, [projects])

  const baseForCounts = useMemo(() => {
    return projects.filter(p => {
      const matchQ = q.trim().length === 0 ||
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
      const matchCat = category === "all" || p.category === category
      return matchQ && matchCat
    })
  }, [q, category])

  const allTags = useMemo(() => {
    const map = new Map<string, number>()
    baseForCounts.forEach(p => p.tags.forEach(t => map.set(t, (map.get(t) || 0) + 1)))
    return Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0]))
  }, [baseForCounts])

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchQ = q.trim().length === 0 ||
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
      const matchCat = category === "all" || p.category === category
      const matchTags = selectedTags.length === 0 || selectedTags.every(t => p.tags.includes(t))
      return matchQ && matchCat && matchTags
    })
  }, [q, category, selectedTags])

  useEffect(() => {
    const spQ = searchParams.get("q") || searchParams.get("search") || ""
    const spCat = (searchParams.get("cat") as string | null) || "all"
    const spTags = searchParams.get("tags") || ""
    const rawLayout = (searchParams.get("layout") as string | null)
    let spLayout: "gallery" | "list" = "gallery"
    if (rawLayout === "list") spLayout = "list"
    if (rawLayout === "gallery") spLayout = "gallery"
    if (rawLayout === "comfortable" || rawLayout === "compact") spLayout = "gallery"
    setQ(spQ)
    setCategory(spCat)
    setSelectedTags(spTags ? spTags.split(",").filter(Boolean) : [])
    setLayout(spLayout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (category && category !== "all") params.set("cat", category)
    if (selectedTags.length) params.set("tags", selectedTags.join(","))
    if (layout !== "gallery") params.set("layout", layout)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname)
  }, [q, category, selectedTags, layout, pathname, router])

  function toggleTag(tag: string) {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function clearFilters() {
    setQ("")
    setCategory("all")
    setSelectedTags([])
  }

  const gridClass = layout === "list"
    ? "mx-auto grid justify-center gap-4 md:max-w-[70rem] grid-cols-1"
    : "mx-auto grid justify-center gap-5 sm:grid-cols-2 md:max-w-[90rem] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="relative pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_400px_at_50%_0%,hsl(var(--primary)/0.08),transparent_70%)]" />
          <div className="container mx-auto">
            <div className="mx-auto max-w-4xl text-center mb-4">
              <div className="h-16 bg-background/40 rounded-2xl animate-pulse mb-6" />
              <div className="h-8 bg-background/40 rounded-xl animate-pulse mx-auto max-w-2xl" />
            </div>
            <div className="mb-6">
              <div className="h-32 bg-background/40 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
        <div className="container mx-auto pb-16">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-background/40 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="relative pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(600px_400px_at_50%_0%,hsl(var(--primary)/0.08),transparent_70%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="container mx-auto"
        >
          <div className="mx-auto max-w-4xl text-center mb-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-heading text-4xl md:text-6xl lg:text-7xl mb-6"
            >
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Project
              </span>{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Downloads
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Production-ready code and complete project files. Zero setup, maximum impact.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/40 backdrop-blur-2xl p-4">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              
              <div className="relative space-y-3">
                <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <EnhancedInput
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search projects, technologies..."
                        className="pl-10 h-10 bg-background/60 border-white/20"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-background/60 border border-white/20 rounded-lg">
                      <Button
                        variant={layout === "gallery" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setLayout("gallery")}
                        className="h-7 px-2 text-xs"
                      >
                        <Grid3x3 className="h-3 w-3 mr-1" />
                        Grid
                      </Button>
                      <Button
                        variant={layout === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setLayout("list")}
                        className="h-7 px-2 text-xs"
                      >
                        <LayoutList className="h-3 w-3 mr-1" />
                        List
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
                    </span>
                    {(q || category !== "all" || selectedTags.length > 0) && (
                      <Badge variant="secondary" className="h-5 text-xs">
                        <Filter className="h-2 w-2 mr-1" />
                        Filtered
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sort by:</span>
                    <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                      <Clock className="h-2 w-2 mr-1" />
                      Latest
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Categories:</span>
                    <div className="flex gap-1">
                      <Button
                        variant={category === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategory("all")}
                        className="h-7 px-2 text-xs"
                      >
                        <Sparkles className="h-2 w-2 mr-1" />
                        All
                      </Button>
                      <Button
                        variant={category === "Roblox" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategory("Roblox")}
                        className="h-7 px-2 text-xs"
                      >
                        <Gamepad2 className="h-2 w-2 mr-1" />
                        Roblox
                      </Button>
                      <Button
                        variant={category === "Web Development" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategory("Web Development")}
                        className="h-7 px-2 text-xs"
                      >
                        <Code className="h-2 w-2 mr-1" />
                        Web Dev
                      </Button>
                    </div>
                  </div>

                  {(q || category !== "all" || selectedTags.length > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="h-7 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <AnimatePresence>
                  {allTags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3 border-t border-white/10">
                        <span className="text-xs font-medium text-muted-foreground mb-2 block">
                          Technologies ({allTags.length}):
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {allTags.map(([tag, count]) => (
                            <motion.div
                              key={tag}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                                className="cursor-pointer px-2 py-0.5 text-xs hover:bg-primary/10 transition-colors"
                                onClick={() => toggleTag(tag)}
                              >
                                {tag}
                                <span className="ml-1 opacity-60">
                                  {count}
                                </span>
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="container mx-auto pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${layout}-${q}-${category}-${selectedTags.join(',')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className={layout === "list" 
              ? "space-y-4" 
              : "grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            }
          >
            {filtered.map((project, index) => {
              return (
                <motion.div
                  key={`${project.id || project.title}-${index}`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: {
                      delay: index * 0.02,
                      duration: 0.3,
                      ease: [0.2, 0.8, 0.2, 1]
                    }
                  }}
                  layout
                  className={layout === "list" ? "w-full" : ""}
                >
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    category={project.category}
                    downloadUrl={project.downloadUrl}
                    githubUrl={project.githubUrl}
                    demoUrl={project.demoUrl}
                    youtubeUrl={project.youtubeUrl}
                    image={project.image}
                    tags={project.tags}
                    reduce={layout === "list"}
                    projectId={project.id}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-lg text-center py-16"
          >
            <div className="relative mb-4">
              <div className="mx-auto h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center">
                <Search className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background border border-white/10 flex items-center justify-center">
                <X className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold mb-3">No projects found</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We couldn&apos;t find any projects matching your criteria. Try adjusting your search terms or clearing some filters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={clearFilters} variant="default">
                <Sparkles className="h-4 w-4 mr-2" />
                Clear all filters
              </Button>
              <Button onClick={() => setLayout("gallery")} variant="outline">
                <Grid3x3 className="h-4 w-4 mr-2" />
                Switch to grid
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
