"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, Github, Youtube, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { generateSlug } from "@/lib/project-utils"

interface ProjectCardProps {
  title: string
  description: string
  category: string
  downloadUrl?: string
  githubUrl?: string
  demoUrl?: string
  youtubeUrl?: string
  tags: string[]
  image?: string
  reduce?: boolean
  projectIndex?: number
  projectId?: string
  cardGradient?: string
  cardColor?: string
}

export function ProjectCard({
  title,
  description,
  category,
  downloadUrl,
  githubUrl,
  demoUrl,
  youtubeUrl,
  tags,
  image,
  reduce,
  projectIndex,
  projectId,
  cardGradient,
  cardColor
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const ytId = youtubeUrl
    ? (() => {
        try {
          const u = new URL(youtubeUrl)
          if (u.hostname === "youtu.be") return u.pathname.slice(1)
          if (u.searchParams.get("v")) return u.searchParams.get("v") || undefined
          const parts = u.pathname.split("/")
          const idx = parts.indexOf("embed")
          if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
        } catch {}
        return undefined
      })()
    : undefined
  const [imgOk, setImgOk] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const isValidSrc = (s?: string) => !!s && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"))

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePosition({ x, y })
      cardRef.current.style.setProperty('--mouse-x', `${x}px`)
      cardRef.current.style.setProperty('--mouse-y', `${y}px`)
      const px = Math.max(0, Math.min(1, x / rect.width))
      const py = Math.max(0, Math.min(1, y / rect.height))
      cardRef.current.style.setProperty('--px', `${px}`)
      cardRef.current.style.setProperty('--py', `${py}`)
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
      return () => card.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  const rawCover = image || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : undefined)
  const cover = isValidSrc(rawCover) && imgOk ? rawCover : undefined
  const useNextImage = (() => {
    if (!cover) return false
    if (cover.startsWith("/")) return true
    try {
      const u = new URL(cover)
      return ["img.youtube.com", "i.ytimg.com"].includes(u.hostname)
    } catch {
      return false
    }
  })()
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: prefersReducedMotion ? 0.2 : 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="[perspective:1000px] group transform-gpu will-change-transform transition-transform duration-300 [transform-style:preserve-3d] hover:[transform:rotateX(calc((var(--py,0.5)-0.5)*6deg))_rotateY(calc((0.5-var(--px,0.5))*8deg))]"
    >
      <Card className={`group/card relative overflow-hidden border-white/10 backdrop-blur-md transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] hover:border-white/20 ${
        cardGradient || cardColor 
          ? `${cardGradient || cardColor}` 
          : 'bg-background/60 hover:bg-background/80'
      }`}>
        <div className="pointer-events-none absolute -inset-0.5 rounded-[inherit] bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(400px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.15),rgba(255,255,255,0.08)_30%,transparent_70%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(220px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(59,130,246,0.12),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -inset-px rounded-[inherit] ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300" />
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.06)_0deg,transparent_120deg,transparent_240deg,rgba(255,255,255,0.06)_360deg)] [mask:linear-gradient(white,transparent)]" />
        {cover && (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <motion.div initial={{ scale: 1 }} whileHover={prefersReducedMotion ? undefined : { scale: 1.035 }} transition={{ duration: prefersReducedMotion ? 0.2 : 0.3 }}>
              {useNextImage ? (
                <Image
                  src={cover}
                  alt={title}
                  width={400}
                  height={225}
                  className="h-full w-full object-cover"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <img
                  src={cover}
                  alt={title}
                  className="h-full w-full object-cover"
                  onError={() => setImgOk(false)}
                />
              )}
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(320px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.1),transparent_62%)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>
        )}
        {!cover && (
          <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 via-background to-muted/30">
            <div className="aspect-video" />
          </div>
        )}
        <CardHeader className={reduce ? "pt-4 pb-2" : undefined}>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className={`text-xs transition-transform duration-200 group-hover:translate-y-[-1px] group-hover:scale-[1.02] ${
              cardGradient || cardColor ? 'bg-black/20 text-white border-white/20' : ''
            }`}>{category}</Badge>
            <div className="flex gap-1">
              {githubUrl && (
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-white/30" asChild>
                  <Link href={githubUrl} target="_blank">
                    <Github className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
              {demoUrl && (
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-white/30" asChild>
                  <Link href={demoUrl} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
              {youtubeUrl && (
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-white/30" asChild>
                  <Link href={youtubeUrl} target="_blank">
                    <Youtube className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <CardTitle className={`${reduce ? "text-lg line-clamp-1" : "line-clamp-2"} ${
            cardGradient || cardColor ? 'text-white' : ''
          }`}>{title}</CardTitle>
          <CardDescription className={`${reduce ? "line-clamp-2" : "line-clamp-3"} ${
            cardGradient || cardColor ? 'text-white/90' : ''
          }`}>{description}</CardDescription>
        </CardHeader>
        <CardContent className={reduce ? "space-y-3 pt-0 px-4 pb-4" : "space-y-4 px-6 pb-6"}>
          <div className="flex flex-wrap gap-1">
            {(() => {
              const max = reduce ? 4 : 6
              const shown = tags.slice(0, max)
              const extra = tags.length - shown.length
              return (
                <>
                  {shown.map((tag, index) => (
                    <Badge key={index} variant="outline" className={`text-xs transition-transform duration-200 group-hover:translate-y-[-1px] group-hover:scale-[1.02] ${
                      cardGradient || cardColor ? 'bg-black/20 text-white border-white/30' : ''
                    }`}>
                      {tag}
                    </Badge>
                  ))}
                  {extra > 0 && (
                    <Badge variant="secondary" className={`text-[10px] px-2 ${
                      cardGradient || cardColor ? 'bg-black/20 text-white border-white/20' : ''
                    }`}>+{extra}</Badge>
                  )}
                </>
              )
            })()}
          </div>
          <div className="flex gap-3">
            {(() => {
              const viewHref = projectId ? `/projects/${projectId}/${generateSlug(title)}` : (demoUrl || githubUrl || downloadUrl)
              return viewHref ? (
                <Button className="relative overflow-hidden flex-1 h-11 font-medium bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/30" asChild>
                  <Link href={viewHref} target={projectId ? "_self" : "_blank"}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
              ) : null
            })()}
            {(() => {
              const learnHref = youtubeUrl || githubUrl
              return learnHref ? (
                <Button variant="outline" className="flex-1 h-11 font-medium border-white/20 hover:border-white/30 hover:bg-white/5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white/30" asChild>
                  <Link href={learnHref} target="_blank">
                    {youtubeUrl ? <Youtube className="mr-2 h-4 w-4" /> : <BookOpen className="mr-2 h-4 w-4" />}
                    Learn
                  </Link>
                </Button>
              ) : null
            })()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
