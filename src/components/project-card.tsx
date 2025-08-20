"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, Github } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {image && (
        <div className="aspect-video overflow-hidden bg-muted">
          <Image
            src={image}
            alt={title}
            width={400}
            height={225}
            className="h-full w-full object-cover transition-all group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{category}</Badge>
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
  )
}
