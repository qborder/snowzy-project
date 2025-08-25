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
  icon?: string
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
  icon,
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
  const rawCover = image || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : undefined)
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
      <Card className={`group/card relative overflow-hidden rounded-2xl transition-all duration-700 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] hover:shadow-primary/20 ${
        cardGradient || cardColor 
          ? `${cardGradient || cardColor} border-white/20 hover:border-white/40 shadow-lg` 
          : 'bg-background/70 hover:bg-background/90 border-white/15 backdrop-blur-lg hover:border-white/30 shadow-md hover:shadow-xl'
      }`}>
        {!(cardGradient || cardColor) && (
          <>
            <div className="pointer-events-none absolute -inset-0.5 rounded-[inherit] bg-gradient-to-br from-primary/25 via-primary/5 to-primary/15 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(500px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.2),rgba(255,255,255,0.12)_30%,transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(280px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(59,130,246,0.18),transparent_60%)] opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
            <div className="pointer-events-none absolute -inset-px rounded-[inherit] ring-1 ring-white/15 group-hover:ring-white/40 group-hover:ring-2 transition-all duration-500" />
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(255,255,255,0.08)_0deg,transparent_120deg,transparent_240deg,rgba(255,255,255,0.08)_360deg)] [mask:linear-gradient(white,transparent)]" />
          </>
        )}
        {(cardGradient || cardColor) && (
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(600px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.1),transparent_60%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        )}
        {cover && (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <motion.div initial={{ scale: 1 }} whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }} transition={{ duration: prefersReducedMotion ? 0.2 : 0.5, ease: "easeOut" }}>
              {useNextImage ? (
                <Image
                  src={cover}
                  alt={title}
                  width={400}
                  height={225}
                  className="h-full w-full object-cover object-center"
                  onError={() => setImgOk(false)}
                />
              ) : (
                <img
                  src={cover}
                  alt={title}
                  className="h-full w-full object-cover object-center"
                  onError={() => setImgOk(false)}
                />
              )}
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-white/0 group-hover:bg-white/8 transition-colors duration-500" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(400px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.15),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-background/10 to-transparent" />
            <div className="absolute top-2 right-2 flex gap-1.5 items-center">
              {githubUrl && (
                <Button variant="ghost" size="sm" className="group/btn h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-black/30 to-black/20 hover:from-primary/40 hover:to-primary/30 border border-white/20 hover:border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary/50 backdrop-blur-sm" asChild>
                  <Link href={githubUrl} target="_blank">
                    <Github className="h-4 w-4 text-white transition-transform duration-200 group-hover/btn:rotate-12" />
                  </Link>
                </Button>
              )}
              {demoUrl && (
                <Button variant="ghost" size="sm" className="group/btn h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-black/30 to-black/20 hover:from-blue-500/40 hover:to-blue-400/30 border border-white/20 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/25 focus-visible:ring-2 focus-visible:ring-blue-400/50 backdrop-blur-sm" asChild>
                  <Link href={demoUrl} target="_blank">
                    <ExternalLink className="h-4 w-4 text-white transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </Button>
              )}
              {youtubeUrl && (
                <Button variant="ghost" size="sm" className="group/btn h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-black/30 to-black/20 hover:from-red-500/40 hover:to-red-400/30 border border-white/20 hover:border-red-400/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-400/25 focus-visible:ring-2 focus-visible:ring-red-400/50 backdrop-blur-sm" asChild>
                  <Link href={youtubeUrl} target="_blank">
                    <Youtube className="h-4 w-4 text-white transition-transform duration-200 group-hover/btn:scale-110" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
        {!cover && (
          <div className="relative overflow-hidden bg-gradient-to-br from-muted/50 via-background to-muted/30">
            <div className="aspect-video" />
            <div className="absolute top-2 right-2 flex gap-1.5 items-center">
              {githubUrl && (
                <Button variant="ghost" size="sm" className="group/btn h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 hover:from-primary/30 hover:to-primary/20 border border-white/10 hover:border-primary/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary/50" asChild>
                  <Link href={githubUrl} target="_blank">
                    <Github className="h-4 w-4 transition-transform duration-200 group-hover/btn:rotate-12" />
                  </Link>
                </Button>
              )}
              {demoUrl && (
                <Button variant="ghost" size="sm" className="group/btn h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 hover:from-blue-500/30 hover:to-blue-400/20 border border-white/10 hover:border-blue-400/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-400/25 focus-visible:ring-2 focus-visible:ring-blue-400/50" asChild>
                  <Link href={demoUrl} target="_blank">
                    <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </Button>
              )}
              {youtubeUrl && (
                <Button variant="ghost" size="sm" className="group/btn h-8 w-8 p-0 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 hover:from-red-500/30 hover:to-red-400/20 border border-white/10 hover:border-red-400/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-400/25 focus-visible:ring-2 focus-visible:ring-red-400/50" asChild>
                  <Link href={youtubeUrl} target="_blank">
                    <Youtube className="h-4 w-4 transition-transform duration-200 group-hover/btn:scale-110" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
        {icon && isValidSrc(icon) && (
          <div className="absolute top-[142px] left-4 z-50">
            <div className="h-28 w-28 rounded-2xl overflow-hidden bg-gradient-to-br from-background via-background to-muted/10 border border-white/10 shadow-xl">
              <img 
                src={icon} 
                alt={`${title} icon`}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </div>
        )}
        <CardHeader className={reduce ? "pt-5 pb-0.5" : icon && isValidSrc(icon) ? "pt-3 pb-3" : "pt-4 pb-4"}>
          <div className={`flex items-start justify-between mb-3 ${icon && isValidSrc(icon) ? 'ml-29' : ''}`}>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`text-xs font-medium px-3 py-1 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:scale-[1.05] hover:shadow-md ${
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
          </div>
          <CardTitle 
            className={`${reduce ? "text-xl line-clamp-1" : "text-2xl line-clamp-2"} font-bold tracking-tight leading-tight ${
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
          <CardDescription className={`${reduce ? "line-clamp-2 text-sm" : "line-clamp-3 text-base"} leading-relaxed mt-2 ${
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
                    <Badge key={index} variant="outline" className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 group-hover:translate-y-[-2px] group-hover:scale-[1.05] hover:shadow-sm ${
                      cardGradient || cardColor ? 'bg-black/20 text-white border-white/30' : ''
                    }`}>
                      {tag}
                    </Badge>
                  ))}
                  {extra > 0 && (
                    <Badge variant="secondary" className={`text-[11px] px-3 py-1 rounded-full font-medium ${
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
                  className="group/main relative overflow-hidden flex-1 h-12 font-bold bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-2xl hover:shadow-primary/40 border border-primary/20 hover:border-primary/50 transition-all duration-500 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl" 
                  asChild
                >
                  <Link 
                    href={viewHref} 
                    target={projectId ? "_self" : "_blank"}
                    onClick={handleViewClick}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover/main:translate-x-full transition-transform duration-1000" />
                    <ExternalLink className="mr-2 h-5 w-5 transition-transform duration-300 group-hover/main:scale-110 group-hover/main:rotate-3" />
                    <span className="relative z-10">View</span>
                  </Link>
                </Button>
              ) : null
            })()}
            {(() => {
              const learnHref = youtubeUrl || githubUrl
              return learnHref ? (
                <Button variant="outline" className="group/learn relative overflow-hidden flex-1 h-12 font-bold bg-gradient-to-r from-background/80 to-background/60 hover:from-background/95 hover:to-background/85 border border-muted-foreground/25 hover:border-muted-foreground/40 hover:bg-primary/8 shadow-md hover:shadow-xl transition-all duration-500 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl" asChild>
                  <Link href={learnHref} target="_blank">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/8 to-primary/0 -translate-x-full group-hover/learn:translate-x-full transition-transform duration-1000" />
                    {youtubeUrl ? <Youtube className="mr-2 h-5 w-5 transition-all duration-300 group-hover/learn:scale-110 group-hover/learn:-rotate-6" /> : <BookOpen className="mr-2 h-5 w-5 transition-all duration-300 group-hover/learn:scale-110 group-hover/learn:text-primary group-hover/learn:rotate-12" />}
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
