"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search } from "lucide-react"

export function SearchBar() {
  const [q, setQ] = useState("")
  const router = useRouter()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (query.length) router.push(`/projects?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={onSubmit} className="relative hidden md:block">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search projects..."
        className="h-10 w-72 rounded-lg border border-white/20 bg-background/60 backdrop-blur-sm px-10 pr-4 text-sm outline-none ring-0 transition-all duration-200 focus:border-primary/50 focus:bg-background/80 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] focus:w-80"
      />
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200" />
    </form>
  )
}
