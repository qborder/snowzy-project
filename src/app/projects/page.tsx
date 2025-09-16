"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { Search, Filter, Grid3x3, Columns3, Clock, Sparkles, Gamepad2, Code, X, TrendingUp, Calendar, Star, ChevronDown, LayoutGrid, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import fallbackProjects from "@/data/projects.json"
import { Project } from "@/types/project"
import { getFavorites } from "@/lib/favorites"
import { ProjectsPageSkeleton } from "@/components/projects-page-skeleton"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [category, setCategory] = useState<string | "all">("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [layout, setLayout] = useState<"gallery" | "masonry" | "compact">("gallery")
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "name">("latest")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
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

  useEffect(() => {
    // Initialize favorites
    setFavorites(getFavorites())

    // Listen for favorite changes
    const handleFavoritesChanged = () => {
      setFavorites(getFavorites())
    }

    window.addEventListener('favoritesChanged', handleFavoritesChanged)
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChanged)
    }
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>(["all"]) 
    projects.filter(p => !p.hidden).forEach(p => set.add(p.category))
    return Array.from(set)
  }, [projects])

  const baseForCounts = useMemo(() => {
    return projects.filter(p => {
      // Filter out hidden projects
      if (p.hidden) return false
      
      const matchQ = q.trim().length === 0 ||
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
      const matchCat = category === "all" || p.category === category
      const matchFav = !showFavoritesOnly || favorites.includes(p.id || '')
      return matchQ && matchCat && matchFav
    })
  }, [projects, q, category, showFavoritesOnly, favorites])

  const allTags = useMemo(() => {
    const map = new Map<string, number>()
    baseForCounts.forEach(p => p.tags.forEach(t => map.set(t, (map.get(t) || 0) + 1)))
    return Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0]))
  }, [baseForCounts])

  const filtered = useMemo(() => {
    return projects
      .filter(p => {
        // Filter out hidden projects
        if (p.hidden) return false
        
        const matchQ = q.trim().length === 0 ||
          p.title.toLowerCase().includes(q.toLowerCase()) ||
          p.description.toLowerCase().includes(q.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
        const matchCat = category === "all" || p.category === category
        const matchTags = selectedTags.length === 0 || selectedTags.every(t => p.tags.includes(t))
        const matchFav = !showFavoritesOnly || favorites.includes(p.id || '')
        return matchQ && matchCat && matchTags && matchFav
      })
      .sort((a, b) => {
        // Sort pinned projects to the top
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        
        // Then sort by the selected sort order
        if (sortBy === "latest") {
          const aDate = new Date(a.createdAt || 0).getTime()
          const bDate = new Date(b.createdAt || 0).getTime()
          return bDate - aDate
        } else if (sortBy === "popular") {
          const aViews = a.views || 0
          const bViews = b.views || 0
          return bViews - aViews
        } else if (sortBy === "name") {
          return a.title.localeCompare(b.title)
        }
        return 0
      })
  }, [projects, q, category, selectedTags, sortBy, showFavoritesOnly, favorites])

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
    setShowFavoritesOnly(false)
  }

  const gridClass = layout === "compact"
    ? "mx-auto grid justify-center gap-4 md:max-w-[70rem] grid-cols-1 sm:grid-cols-2"
    : layout === "masonry"
    ? "mx-auto columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6"
    : "mx-auto grid justify-center gap-5 sm:grid-cols-2 md:max-w-[90rem] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"

  if (loading) {
    return <ProjectsPageSkeleton />
  }         

  return (
    <div className="min-h-screen">
      <div className="relative pt-16 pb-12 md:pt-20 md:pb-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_800px_400px_at_50%_0%,hsl(var(--primary)/0.03),transparent)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="container mx-auto"
        >
          <div className="mx-auto max-w-5xl text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium">
                  <Star className="h-3.5 w-3.5 mr-1.5" />
                  {projects.filter(p => !p.hidden).length} Projects
                </Badge>
                <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium">
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  Updated Daily
                </Badge>
              </div>
              <h1 className="font-mono text-5xl md:text-7xl lg:text-8xl mb-8 tracking-tight font-bold">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  Project
                </span>{" "}
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                  Downloads
                </span>
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              Production-ready code and complete project files. Zero setup, maximum impact.
              <span className="block text-base mt-3 opacity-70 font-medium">Browse {categories.length - 1} categories • {allTags.length} technologies</span>
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/80 backdrop-blur-xl p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/70" />
              <div className="absolute inset-0 border-b border-white/5" />
              
              <div className="relative space-y-5">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                  <div className="flex-1">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <EnhancedInput
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search projects, technologies, categories..."
                        className="pl-12 h-12 bg-background/80 border-border/50 text-base placeholder:text-muted-foreground/60 focus:border-primary/40 focus:bg-background/90 transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 p-1 bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl shadow-sm">
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
                    <span className="text-sm font-medium text-foreground/90">Filters:</span>
                    <Button
                      variant={showFavoritesOnly ? "gradient" : "outline"}
                      size="sm"
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      className="h-7 px-3 text-xs font-medium"
                    >
                      <Heart className={`h-3 w-3 mr-1.5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                      Favorites {showFavoritesOnly ? `(${favorites.length})` : ''}
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {filtered.length}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        project{filtered.length !== 1 ? 's' : ''} found
                      </span>
                    </div>
                    {(q || category !== "all" || selectedTags.length > 0 || showFavoritesOnly) && (
                      <Badge variant="secondary" className="h-6 text-xs px-2">
                        <Filter className="h-3 w-3 mr-1" />
                        Active Filters
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground/80">Sort by:</span>
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
                    <span className="text-sm font-medium text-foreground/90">Categories:</span>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={category === "all" ? "gradient" : "glass"}
                        size="sm"
                        onClick={() => setCategory("all")}
                        className="h-9 px-4 text-xs font-medium rounded-xl"
                      >
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        All ({projects.filter(p => !p.hidden).length})
                      </Button>
                      {categories.filter(cat => cat !== "all").map(cat => {
                        const count = projects.filter(p => p.category === cat && !p.hidden).length
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
                      <div className="pt-3 border-t border-border/30">
                        <span className="text-xs font-medium text-foreground/80 mb-2 block">
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

      <div className="container mx-auto pb-20">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold mb-2">
              {filtered.length > 0 ? (
                <span>Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
              ) : (
                <span>No projects found</span>
              )}
            </h2>
            {(q || category !== "all" || selectedTags.length > 0) && (
              <p className="text-muted-foreground">
                {q && <span>matching &ldquo;{q}&rdquo;</span>}
                {category !== "all" && <span> in {category}</span>}
                {selectedTags.length > 0 && <span> with {selectedTags.join(", ")}</span>}
              </p>
            )}
          </motion.div>
        </div>
        
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
                    pinned={project.pinned}
                    hidden={project.hidden}
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
            className="mx-auto max-w-2xl text-center py-20"
          >
            <div className="relative mb-6">
              <div className="mx-auto h-32 w-32 rounded-full bg-muted/10 flex items-center justify-center">
                <Search className="h-16 w-16 text-muted-foreground/40" />
              </div>
              <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-background border border-border/50 flex items-center justify-center shadow-sm">
                <X className="h-5 w-5 text-muted-foreground" />
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
