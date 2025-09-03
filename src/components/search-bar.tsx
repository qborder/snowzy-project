"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, X } from "lucide-react"
import { motion } from "framer-motion"

export function SearchBar() {
  const [q, setQ] = useState("")
  const [focused, setFocused] = useState(false)
  const router = useRouter()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (query.length) router.push(`/projects?q=${encodeURIComponent(query)}`)
  }

  function clearSearch() {
    setQ("")
  }

  return (
    <form onSubmit={onSubmit} className="relative hidden md:block">
      <motion.div
        animate={{ 
          width: focused ? "20rem" : "18rem",
          scale: focused ? 1.02 : 1
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search projects..."
          className="h-11 w-full rounded-xl border border-white/20 bg-background/70 backdrop-blur-sm px-11 pr-10 text-sm outline-none ring-0 transition-all duration-300 focus:border-primary/60 focus:bg-background/90 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] placeholder:text-muted-foreground/60 hover:border-white/30 hover:bg-background/80"
        />
        <Search className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-200 ${focused ? 'text-primary' : 'text-muted-foreground'}`} />
        {q && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted/50 transition-colors duration-200"
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </motion.button>
        )}
      </motion.div>
    </form>
  )
}
