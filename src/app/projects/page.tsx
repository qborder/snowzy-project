"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { Search, Grid3X3, LayoutList, Sparkles, Code, Gamepad2, Filter, Download, Clock, X, Grid2X2, List } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import projectsData from "@/data/projects.json"

const projects = projectsData

export default function ProjectsPage() {
  const [q, setQ] = useState("")
  const [category, setCategory] = useState<string | "all">("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [layout, setLayout] = useState<"gallery" | "list">("gallery")
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const categories = useMemo(() => {
    const set = new Set<string>(["all"]) 
    projects.forEach(p => set.add(p.category))
    return Array.from(set)
  }, [])

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
    const spQ = searchParams.get("q") || ""
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
  }, [])

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
          <div className="mx-auto max-w-4xl text-center mb-8">
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
            className="mb-16"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-background/40 backdrop-blur-2xl p-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              
              <div className="relative space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <EnhancedInput
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Search projects, technologies..."
                        className="pl-11 h-11 bg-background/60 border-white/20"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 p-1 bg-background/60 border border-white/20 rounded-xl">
                      <Button
                        variant={layout === "gallery" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setLayout("gallery")}
                        className="h-8 px-3"
                      >
                        <Grid3X3 className="h-3 w-3 mr-1" />
                        Grid
                      </Button>
                      <Button
                        variant={layout === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setLayout("list")}
                        className="h-8 px-3"
                      >
                        <LayoutList className="h-3 w-3 mr-1" />
                        List
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
                    </span>
                    {(q || category !== "all" || selectedTags.length > 0) && (
                      <Badge variant="secondary" className="h-6">
                        <Filter className="h-3 w-3 mr-1" />
                        Filtered
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Sort by:</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Latest
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Categories:</span>
                    <div className="flex gap-2">
                      <Button
                        variant={category === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategory("all")}
                        className="h-8"
                      >
                        <Sparkles className="h-3 w-3 mr-2" />
                        All
                      </Button>
                      <Button
                        variant={category === "Roblox" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategory("Roblox")}
                        className="h-8"
                      >
                        <Gamepad2 className="h-3 w-3 mr-2" />
                        Roblox
                      </Button>
                      <Button
                        variant={category === "Web Development" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCategory("Web Development")}
                        className="h-8"
                      >
                        <Code className="h-3 w-3 mr-2" />
                        Web Dev
                      </Button>
                    </div>
                  </div>

                  {(q || category !== "all" || selectedTags.length > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8"
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
                      <div className="pt-4 border-t border-white/10">
                        <span className="text-sm font-medium text-muted-foreground mb-3 block">
                          Technologies ({allTags.length}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {allTags.map(([tag, count]) => (
                            <motion.div
                              key={tag}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Badge
                                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                                className="cursor-pointer px-3 py-1 hover:bg-primary/10 transition-colors"
                                onClick={() => toggleTag(tag)}
                              >
                                {tag}
                                <span className="ml-2 opacity-60">
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

      <div className="container mx-auto pb-16 pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${layout}-${q}-${category}-${selectedTags.join(',')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className={layout === "list" 
              ? "space-y-4" 
              : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }
          >
            {filtered.map((project, index) => (
              <motion.div
                key={`${project.title}-${index}`}
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
                  tags={project.tags}
                  reduce={layout === "list"}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto max-w-lg text-center py-16"
          >
            <div className="relative mb-8">
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
                <Grid3X3 className="h-4 w-4 mr-2" />
                Switch to grid
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
