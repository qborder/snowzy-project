"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink, Download, Youtube, Calendar, Code, Gamepad2, Globe, Tag } from "lucide-react"
import { Project } from "@/types/project"

export default function ProjectViewPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch("/api/projects")
        if (!res.ok) throw new Error("Failed to load projects")
        const projects = await res.json()
        const projectIndex = parseInt(params.id as string)
        if (isNaN(projectIndex) || !projects[projectIndex]) {
          notFound()
        }
        setProject(projects[projectIndex])
      } catch (err) {
        console.error("Error loading project:", err)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    loadProject()
  }, [params.id])

  function getYoutubeEmbedUrl(url: string): string | null {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/10 rounded w-1/3"></div>
          <div className="h-64 bg-white/10 rounded"></div>
          <div className="h-32 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  if (!project) return notFound()

  const embedUrl = project.youtubeUrl ? getYoutubeEmbedUrl(project.youtubeUrl) : null

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {project.title}
                </h1>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Badge variant="default" className="text-sm">
                    {project.category === "Roblox" && <Gamepad2 className="h-3 w-3 mr-1" />}
                    {project.category?.includes("Web") && <Globe className="h-3 w-3 mr-1" />}
                    {project.category?.includes("Mobile") && <Code className="h-3 w-3 mr-1" />}
                    {project.category}
                  </Badge>
                  {project.createdAt && (
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {embedUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  Video Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={embedUrl}
                    title={`${project.title} Demo`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}

          {project.image && !embedUrl && (
            <Card>
              <CardContent className="p-0">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {project.image && embedUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
              <CardDescription>Access project resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.demoUrl && (
                <Link href={project.demoUrl} target="_blank">
                  <Button className="w-full justify-start" variant="default">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                </Link>
              )}
              {project.downloadUrl && (
                <Link href={project.downloadUrl} target="_blank">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </Link>
              )}
              {project.githubUrl && (
                <Link href={project.githubUrl} target="_blank">
                  <Button className="w-full justify-start" variant="outline">
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                </Link>
              )}
              {project.youtubeUrl && (
                <Link href={project.youtubeUrl} target="_blank">
                  <Button className="w-full justify-start" variant="outline">
                    <Youtube className="h-4 w-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </Link>
              )}
              {!project.demoUrl && !project.downloadUrl && !project.githubUrl && !project.youtubeUrl && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No external links available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
