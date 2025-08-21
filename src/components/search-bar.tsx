"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchBar() {
  const [q, setQ] = useState("")
  const router = useRouter()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (query.length) router.push(`/projects?search=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={onSubmit} className="relative hidden md:block">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search projects..."
        className="h-9 w-64 rounded-md border bg-background px-9 text-sm outline-none ring-0 transition focus:border-primary/40 focus:bg-background focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
      />
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
        Go
      </Button>
    </form>
  )
}
