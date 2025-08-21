"use client"

import { ProjectCard } from "@/components/project-card"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { List, Grid2X2, X, Filter } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const projects = [
  {
    title: "Advanced Roblox Admin System",
    description: "Complete admin system with GUI, commands, and user management for Roblox games. Includes ban/kick, teleport, and moderation tools.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/roblox-admin",
    githubUrl: "https://github.com/snowzy/roblox-admin",
    tags: ["Lua", "GUI", "Admin", "Commands", "Moderation"],
  },
  {
    title: "Modern Dashboard Template",
    description: "Responsive dashboard built with Next.js, TypeScript, and Tailwind CSS. Perfect for admin panels and data visualization.",
    category: "Web Development",
    downloadUrl: "https://github.com/snowzy/dashboard-template",
    githubUrl: "https://github.com/snowzy/dashboard-template",
    demoUrl: "https://dashboard-demo.vercel.app",
    tags: ["Next.js", "TypeScript", "Dashboard", "React", "Tailwind"],
  },
  {
    title: "Roblox RPG Combat System",
    description: "Complete RPG combat system with skills, levels, special abilities, and damage calculations for immersive gameplay.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/rpg-combat",
    githubUrl: "https://github.com/snowzy/rpg-combat",
    tags: ["RPG", "Combat", "Skills", "Levels", "Gameplay"],
  },
  {
    title: "React E-commerce Store",
    description: "Full-featured e-commerce application with cart, payments, and user authentication using modern React patterns.",
    category: "Web Development",
    downloadUrl: "https://github.com/snowzy/react-ecommerce",
    githubUrl: "https://github.com/snowzy/react-ecommerce",
    demoUrl: "https://store-demo.vercel.app",
    tags: ["React", "E-commerce", "Authentication", "Payments"],
  },
  {
    title: "Roblox Chat System",
    description: "Advanced chat system with channels, private messages, moderation, and custom commands for Roblox games.",
    category: "Roblox",
    downloadUrl: "https://github.com/snowzy/roblox-chat",
    githubUrl: "https://github.com/snowzy/roblox-chat",
    tags: ["Chat", "Messaging", "Moderation", "Commands"],
  },
  {
    title: "Vue.js Portfolio Template",
    description: "Modern portfolio template built with Vue 3, featuring smooth animations and responsive design.",
    category: "Web Development",
    downloadUrl: "https://github.com/snowzy/vue-portfolio",
    githubUrl: "https://github.com/snowzy/vue-portfolio",
    demoUrl: "https://portfolio-demo.vercel.app",
    tags: ["Vue.js", "Portfolio", "Animations", "Responsive"],
  },
]

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
    <div className="container space-y-8 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          All projects
        </h1>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Explore everything I’ve shipped — filter by tags, search by name, and switch layouts.
        </p>
      </div>

      <div className="sticky top-16 z-40 mx-auto max-w-[80rem] rounded-xl border border-white/10 bg-background/60 p-3 backdrop-blur-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full max-w-md">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search projects..."
                className="h-10 w-full rounded-md border border-white/10 bg-background/60 pl-3 pr-10 text-sm outline-none ring-0 backdrop-blur-md transition focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
              />
              <Button onClick={() => setQ("")} variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={layout === "gallery" ? "default" : "outline"} size="icon" onClick={() => setLayout("gallery")} aria-label="Gallery layout">
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button variant={layout === "list" ? "default" : "outline"} size="icon" onClick={() => setLayout("list")} aria-label="List layout">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-10 rounded-md border border-white/10 bg-background/60 px-3 text-sm backdrop-blur-md"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="mr-2 h-4 w-4" />Clear
            </Button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {allTags.map(([tag, count]) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer select-none"
              onClick={() => toggleTag(tag)}
            >
              {tag} · {count}
            </Badge>
          ))}
        </div>
      </div>

      <div className={gridClass}>
        {filtered.map((project, index) => (
          <ProjectCard
            key={`${project.title}-${index}`}
            title={project.title}
            description={project.description}
            category={project.category}
            downloadUrl={project.downloadUrl}
            githubUrl={project.githubUrl}
            demoUrl={project.demoUrl}
            tags={project.tags}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full mx-auto max-w-xl rounded-xl border border-white/10 bg-background/60 p-8 text-center backdrop-blur-md">
            <div className="mb-2 text-xl font-medium">No results</div>
            <p className="text-sm text-muted-foreground">Try clearing filters or adjusting your search.</p>
            <div className="mt-4 flex justify-center gap-2">
              <Button onClick={clearFilters} variant="outline">Clear filters</Button>
              <Button onClick={() => setLayout("gallery")} variant="ghost">Gallery layout</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
