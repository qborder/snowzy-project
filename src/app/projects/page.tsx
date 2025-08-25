"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { Search, Filter, Grid3x3, Columns3, Clock, Sparkles, Gamepad2, Code, X, TrendingUp, Calendar, Star, ChevronDown, LayoutGrid } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import fallbackProjects from "@/data/projects.json"

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
  icon?: string
  tags: string[]
  createdAt?: string
  cardGradient?: string
  cardColor?: string
  views?: number
  downloads?: number
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [category, setCategory] = useState<string | "all">("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [layout, setLayout] = useState<"gallery" | "masonry" | "compact">("gallery")
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "name">("latest")
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects')
        let data: unknown = []
        if (res.ok) {
          data = await res.json()
        } else {
          data = fallbackProjects
        }
        setProjects(Array.isArray(data) ? (data as Project[]) : [])
      } catch {
        setProjects(Array.isArray(fallbackProjects) ? (fallbackProjects as Project[]) : [])
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
  }, [projects, q, category, selectedTags])

  useEffect(() => {
    const spQ = searchParams.get("q") || searchParams.get("search") || ""
    const spCat = (searchParams.get("cat") as string | null) || "all"
    const spTags = searchParams.get("tags") || ""
    const rawLayout = (searchParams.get("layout") as string | null)
    let spLayout: "gallery" | "masonry" | "compact" = "gallery"
    if (rawLayout === "masonry") spLayout = "masonry"
    if (rawLayout === "compact") spLayout = "compact"
    if (rawLayout === "gallery") spLayout = "gallery"
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

  const gridClass = layout === "compact"
    ? "mx-auto grid justify-center gap-4 md:max-w-[70rem] grid-cols-1 sm:grid-cols-2"
    : layout === "masonry"
    ? "mx-auto columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Star className="h-3 w-3 mr-1" />
                  {projects.length} Projects
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Updated Daily
                </Badge>
              </div>
              <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl mb-6">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Project
                </span>{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Downloads
                </span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Production-ready code and complete project files. Zero setup, maximum impact.
              <span className="block text-sm mt-2 opacity-80">Browse {categories.length - 1} categories • {allTags.length} technologies</span>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-background/60 backdrop-blur-2xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-primary/10" />
              <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_50%_0%,rgba(255,255,255,0.05),transparent_70%)]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-xl"></div>
              
              <div className="relative space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                  <div className="flex-1">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <EnhancedInput
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search projects, technologies, categories..."
                        className="pl-12 h-12 bg-background/60 border-white/20 text-base placeholder:text-muted-foreground/60 focus:border-primary/30 focus:bg-background/80"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg">
                      <Button
                        variant={layout === "gallery" ? "gradient" : "ghost"}
                        size="sm"
                        onClick={() => setLayout("gallery")}
                        className="h-9 px-3 text-xs font-medium rounded-lg"
                      >
                        <Grid3x3 className="h-3 w-3 mr-1" />
                        Grid
                      </Button>
                      <Button
                        variant={layout === "masonry" ? "gradient" : "ghost"}
                        size="sm"
                        onClick={() => setLayout("masonry")}
                        className="h-9 px-3 text-xs font-medium rounded-lg"
                      >
                        <Columns3 className="h-3 w-3 mr-1" />
                        Masonry
                      </Button>
                      <Button
                        variant={layout === "compact" ? "gradient" : "ghost"}
                        size="sm"
                        onClick={() => setLayout("compact")}
                        className="h-9 px-3 text-xs font-medium rounded-lg"
                      >
                        <LayoutGrid className="h-3 w-3 mr-1" />
                        Compact
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {filtered.length}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        project{filtered.length !== 1 ? 's' : ''} found
                      </span>
                    </div>
                    {(q || category !== "all" || selectedTags.length > 0) && (
                      <Badge variant="secondary" className="h-6 text-xs px-2">
                        <Filter className="h-3 w-3 mr-1" />
                        Active Filters
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Sort by:</span>
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs px-3 gap-1"
                        onClick={() => {
                          const options = ["latest", "popular", "name"] as const
                          const current = options.indexOf(sortBy)
                          setSortBy(options[(current + 1) % options.length])
                        }}
                      >
                        {sortBy === "latest" && <><Calendar className="h-3 w-3" />Latest</>}
                        {sortBy === "popular" && <><TrendingUp className="h-3 w-3" />Popular</>}
                        {sortBy === "name" && <><Code className="h-3 w-3" />Name</>}
                        <ChevronDown className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">Categories:</span>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={category === "all" ? "gradient" : "glass"}
                        size="sm"
                        onClick={() => setCategory("all")}
                        className="h-9 px-4 text-xs font-medium rounded-xl"
                      >
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        All ({projects.length})
                      </Button>
                      {categories.filter(cat => cat !== "all").map(cat => {
                        const count = projects.filter(p => p.category === cat).length
                        const icon = cat.toLowerCase().includes('roblox') ? Gamepad2 : Code
                        const IconComponent = icon
                        return (
                          <Button
                            key={cat}
                            variant={category === cat ? "gradient" : "glass"}
                            size="sm"
                            onClick={() => setCategory(cat)}
                            className="h-9 px-4 text-xs font-medium rounded-xl"
                          >
                            <IconComponent className="h-3 w-3 mr-1.5" />
                            {cat} ({count})
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  {(q || category !== "all" || selectedTags.length > 0) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 px-3 text-xs font-medium rounded-xl"
                    >
                      <X className="h-3 w-3 mr-1" />
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
            className={layout === "compact" 
              ? "grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : layout === "masonry"
              ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6"
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
                  className={layout === "masonry" ? "break-inside-avoid mb-6" : "w-full"}
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
                    icon={project.icon}
                    tags={project.tags}
                    reduce={layout === "compact"}
                    projectId={project.id}
                    views={project.views}
                    downloads={project.downloads}
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
