"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, Github, Youtube, BookOpen, Eye, ArrowDown } from "lucide-react"
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
  titleColor?: string
  titleGradient?: {
    from: string
    to: string
    via?: string
  }
  views?: number
  downloads?: number
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
  cardColor,
  titleColor,
  titleGradient,
  views = 0,
  downloads = 0,
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion()
  
  const handleViewClick = async () => {
    if (projectId) {
      try {
        await fetch(`/api/projects/${projectId}/views`, {
          method: 'POST',
        })
      } catch (error) {
        console.error('Failed to increment view count:', error)
      }
    }
  }
  
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
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const isValidSrc = (s?: string) => !!s && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"))

  useEffect(() => {
    const updateTransform = (x: number, y: number, rect: DOMRect) => {
      if (!cardRef.current || prefersReducedMotion) return
      
      const px = Math.max(0, Math.min(1, x / rect.width))
      const py = Math.max(0, Math.min(1, y / rect.height))
      
      const rotateX = (py - 0.5) * 20
      const rotateY = (0.5 - px) * 20
      const translateZ = isHovered ? 20 : 0
      const scale = isHovered ? 1.05 : 1
      
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`
      cardRef.current.style.setProperty('--mouse-x', `${x}px`)
      cardRef.current.style.setProperty('--mouse-y', `${y}px`)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current || prefersReducedMotion) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePosition({ x, y })
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      animationRef.current = requestAnimationFrame(() => {
        updateTransform(x, y, rect)
      })
    }

    const handleMouseEnter = () => {
      if (prefersReducedMotion) return
      setIsHovered(true)
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
      }
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      if (!cardRef.current) return
      cardRef.current.style.setProperty('--mouse-x', `50%`)
      cardRef.current.style.setProperty('--mouse-y', `50%`)
      cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)'
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mousemove', handleMouseMove)
      card.addEventListener('mouseleave', handleMouseLeave)
      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter)
        card.removeEventListener('mousemove', handleMouseMove)
        card.removeEventListener('mouseleave', handleMouseLeave)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [prefersReducedMotion, isHovered])
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
    <div
      ref={cardRef}
      className="group [transform-style:preserve-3d] will-change-transform"
    >
      <Card className={`group/card relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] ${
        cardGradient || cardColor 
          ? `${cardGradient || cardColor} border-white/20 hover:border-white/30` 
          : 'bg-background/60 hover:bg-background/80 border-white/10 backdrop-blur-md hover:border-white/20'
      }`}>
        {!(cardGradient || cardColor) && (
          <>
            <div className="pointer-events-none absolute -inset-0.5 rounded-[inherit] bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(400px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.15),rgba(255,255,255,0.08)_30%,transparent_70%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(220px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(59,130,246,0.12),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute -inset-px rounded-[inherit] ring-1 ring-white/10 group-hover:ring-white/30 transition-all duration-300" />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.06)_0deg,transparent_120deg,transparent_240deg,rgba(255,255,255,0.06)_360deg)] [mask:linear-gradient(white,transparent)]" />
          </>
        )}
        {(cardGradient || cardColor) && (
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.1),transparent_60%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        )}
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
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`text-xs transition-transform duration-200 group-hover:translate-y-[-1px] group-hover:scale-[1.02] ${
                cardGradient || cardColor ? 'bg-black/20 text-white border-white/20' : ''
              }`}>{category}</Badge>
              {(views !== undefined || downloads !== undefined) && (
                <div className="flex items-center gap-2">
                  {views !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span className="font-medium">{views.toLocaleString()}</span>
                    </div>
                  )}
                  {downloads !== undefined && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ArrowDown className="h-3 w-3" />
                      <span className="font-medium">{downloads.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-1.5">
              {githubUrl && (
                <Button variant="ghost" size="sm" className="group/btn h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 hover:from-primary/20 hover:to-primary/10 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary/50" asChild>
                  <Link href={githubUrl} target="_blank">
                    <Github className="h-4 w-4 transition-transform duration-200 group-hover/btn:rotate-12" />
                  </Link>
                </Button>
              )}
              {demoUrl && (
                <Button variant="ghost" size="sm" className="group/btn h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 hover:from-blue-500/20 hover:to-blue-400/10 border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/25 focus-visible:ring-2 focus-visible:ring-blue-400/50" asChild>
                  <Link href={demoUrl} target="_blank">
                    <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </Button>
              )}
              {youtubeUrl && (
                <Button variant="ghost" size="sm" className="group/btn h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-muted/30 to-muted/10 hover:from-red-500/20 hover:to-red-400/10 border border-white/10 hover:border-red-400/30 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-400/25 focus-visible:ring-2 focus-visible:ring-red-400/50" asChild>
                  <Link href={youtubeUrl} target="_blank">
                    <Youtube className="h-4 w-4 transition-transform duration-200 group-hover/btn:scale-110" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <CardTitle 
            className={`${reduce ? "text-lg line-clamp-1" : "line-clamp-2"} ${
              titleGradient 
                ? 'bg-clip-text text-transparent' 
                : titleColor 
                  ? '' 
                  : cardGradient || cardColor ? 'text-white' : ''
            }`}
            style={{
              backgroundImage: titleGradient 
                ? `linear-gradient(to right, ${titleGradient.from}${titleGradient.via ? `, ${titleGradient.via}` : ''}, ${titleGradient.to})`
                : undefined,
              color: titleColor || undefined
            }}
          >{title}</CardTitle>
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
                <Button 
                  className="group/main relative overflow-hidden flex-1 h-11 font-semibold bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/95 hover:via-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary/50" 
                  asChild
                >
                  <Link 
                    href={viewHref} 
                    target={projectId ? "_self" : "_blank"}
                    onClick={handleViewClick}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/main:translate-x-full transition-transform duration-700" />
                    <ExternalLink className="mr-2 h-4 w-4 transition-transform duration-200 group-hover/main:scale-110" />
                    <span className="relative z-10">View</span>
                  </Link>
                </Button>
              ) : null
            })()}
            {(() => {
              const learnHref = youtubeUrl || githubUrl
              return learnHref ? (
                <Button variant="outline" className="group/learn relative overflow-hidden flex-1 h-11 font-semibold bg-gradient-to-r from-background/80 to-background/60 hover:from-background/90 hover:to-background/80 border border-muted-foreground/20 hover:border-muted-foreground/30 hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary/50" asChild>
                  <Link href={learnHref} target="_blank">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover/learn:translate-x-full transition-transform duration-700" />
                    {youtubeUrl ? <Youtube className="mr-2 h-4 w-4 transition-all duration-200 group-hover/learn:scale-110" /> : <BookOpen className="mr-2 h-4 w-4 transition-all duration-200 group-hover/learn:scale-110 group-hover/learn:text-primary" />}
                    <span className="relative z-10">Learn</span>
                  </Link>
                </Button>
              ) : null
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
