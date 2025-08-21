"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, Github } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

interface ProjectCardProps {
  title: string
  description: string
  category: string
  downloadUrl?: string
  githubUrl?: string
  demoUrl?: string
  tags: string[]
  image?: string
}

export function ProjectCard({
  title,
  description,
  category,
  downloadUrl,
  githubUrl,
  demoUrl,
  tags,
  image
}: ProjectCardProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      whileHover={reduce ? undefined : { 
        y: -8, 
        rotateX: 2,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      transition={{ duration: reduce ? 0.2 : 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="[perspective:1000px] group"
    >
      <Card className="group/card overflow-hidden border-white/10 bg-background/60 backdrop-blur-md transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] hover:border-white/20 hover:bg-background/80 relative">
        <div className="pointer-events-none absolute -inset-0.5 rounded-[inherit] bg-gradient-to-br from-primary/20 via-transparent to-primary/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(600px_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.06),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {image && (
          <div className="relative aspect-video overflow-hidden bg-muted">
            <motion.div initial={{ scale: 1 }} whileHover={reduce ? undefined : { scale: 1.03 }} transition={{ duration: reduce ? 0.2 : 0.3 }}>
              <Image
                src={image}
                alt={title}
                width={400}
                height={225}
                className="h-full w-full object-cover"
              />
            </motion.div>
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            <div className="absolute left-2 top-2">
              <Badge variant="secondary" className="backdrop-blur bg-background/80 border-white/10">{category}</Badge>
            </div>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center justify-between">
            {!image && <Badge variant="secondary">{category}</Badge>}
            <div className="flex space-x-1">
              {githubUrl && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={githubUrl} target="_blank">
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {demoUrl && (
                <Button variant="ghost" size="icon" asChild>
                  <Link href={demoUrl} target="_blank">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription className="line-clamp-3">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {downloadUrl && (
            <Button className="w-full" asChild>
              <Link href={downloadUrl} target="_blank">
                <Download className="mr-2 h-4 w-4" />
                Download Project
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
