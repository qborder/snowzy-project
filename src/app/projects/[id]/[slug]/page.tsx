"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink, Download, Youtube, Calendar, Code, Gamepad2, Globe, Tag, Sparkles, Clock, Eye } from "lucide-react"
import { MarkdownViewer } from "@/components/markdown-editor"

type Project = {
  id?: string
  title: string
  description: string
  category: string
  downloadUrl?: string
  githubUrl?: string
  demoUrl?: string
  youtubeUrl?: string
  image?: string
  tags?: string[]
  createdAt?: string
  content?: string
}

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
        
        const projectId = params.id as string
        const foundProject = projects.find((p: Project) => p.id === projectId)
        
        if (!foundProject) {
          notFound()
        }
        setProject(foundProject)
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto max-w-7xl py-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                <div className="absolute inset-0 rounded-full h-16 w-16 border-2 border-primary/20 mx-auto"></div>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-medium text-foreground">Loading project...</p>
                <p className="text-muted-foreground">Please wait while we fetch the details</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) return notFound()

  const embedUrl = project.youtubeUrl ? getYoutubeEmbedUrl(project.youtubeUrl) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto max-w-7xl py-8">
        <div className="mb-4">
          <Link href="/projects">
            <Button variant="outline" size="sm" className="mb-3 bg-background/60 backdrop-blur-sm border-white/20 hover:bg-primary/10 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 rounded-3xl blur-3xl -z-10"></div>
          <div className="bg-gradient-to-br from-background/90 via-background/95 to-background/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-xl"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl border border-primary/20 shadow-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 text-sm px-3 py-1.5 font-medium shadow-sm">
                    {project.category === "Roblox" && <Gamepad2 className="h-4 w-4 mr-2" />}
                    {project.category?.includes("Web") && <Globe className="h-4 w-4 mr-2" />}
                    {project.category?.includes("Mobile") && <Code className="h-4 w-4 mr-2" />}
                    {project.category}
                  </Badge>
                  {project.createdAt && (
                    <div className="flex items-center gap-2 text-sm bg-background/50 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl font-black bg-gradient-to-r from-foreground via-primary to-purple-400 bg-clip-text text-transparent leading-tight tracking-tight">
                  {project.title}
                </h1>
                
                <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap max-w-4xl font-light">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">

            {embedUrl && (
              <Card className="bg-background/70 backdrop-blur-xl border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <CardHeader className="bg-gradient-to-r from-red-500/20 via-red-600/15 to-red-500/20 border-b border-red-500/20">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 bg-gradient-to-br from-red-500/30 to-red-600/20 rounded-xl border border-red-500/30 shadow-lg">
                      <Youtube className="h-7 w-7 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">Video Demo</p>
                      <p className="text-sm text-muted-foreground font-normal">Watch the project in action</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
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
              <Card className="bg-background/70 backdrop-blur-xl border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl border border-primary/20 shadow-lg">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">Project Preview</p>
                      <p className="text-sm text-muted-foreground font-normal">Visual showcase</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {project.content && (
              <Card className="bg-background/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl border border-primary/20 shadow-lg">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">Documentation</p>
                      <p className="text-sm text-muted-foreground font-normal">Detailed information and usage guide</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-invert prose-lg max-w-none">
                    <MarkdownViewer content={project.content} />
                  </div>
                </CardContent>
              </Card>
            )}

            {project.image && embedUrl && (
              <Card className="bg-background/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 group">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl border border-primary/20 shadow-lg">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">Screenshots</p>
                      <p className="text-sm text-muted-foreground font-normal">Additional visual content</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8 space-y-6">
              {project.tags && project.tags.length > 0 && (
                <Card className="bg-gradient-to-br from-background/80 via-background/90 to-primary/5 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-5 relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="relative">
                        <div className="p-1.5 bg-gradient-to-br from-primary/40 to-primary/20 rounded-lg border border-primary/30 shadow-md">
                          <Tag className="h-4 w-4 text-primary" />
                        </div>
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Tech Stack</h3>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <Badge 
                          key={tag}
                          variant="outline" 
                          className="text-xs bg-gradient-to-br from-background/80 to-background/60 border border-white/20 hover:border-primary/40 text-foreground font-medium px-2 py-1 rounded-lg backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                        <span className="font-medium">{project.tags.length} technologies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card className="bg-gradient-to-br from-background/80 via-background/90 to-background/95 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 group overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-purple-500/10 border-b border-white/10 relative rounded-t-3xl">
                  <CardTitle className="flex items-center gap-4 text-xl relative z-10">
                    <div className="p-3 bg-gradient-to-br from-primary/30 to-primary/10 rounded-2xl border border-primary/20 shadow-lg">
                      <ExternalLink className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">Quick Access</p>
                      <p className="text-sm text-muted-foreground font-normal">Project resources & links</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 p-8 relative z-10">
                  {project.demoUrl && (
                    <Link href={project.demoUrl} target="_blank">
                      <Button className="w-full justify-start h-16 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 text-primary-foreground group/btn rounded-2xl" size="lg">
                        <div className="p-2 bg-white/20 rounded-xl mr-4 group-hover/btn:bg-white/30 transition-colors">
                          <ExternalLink className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-lg">Live Demo</span>
                          <span className="text-sm opacity-90 font-light">Experience it live</span>
                        </div>
                      </Button>
                    </Link>
                  )}
                  {project.downloadUrl && (
                    <Link href={project.downloadUrl} target="_blank">
                      <Button className="w-full justify-start h-16 bg-background/60 border border-white/20 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg rounded-2xl" variant="outline" size="lg">
                        <div className="p-2 bg-primary/10 rounded-xl mr-4">
                          <Download className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-lg text-foreground">Download</span>
                          <span className="text-sm text-muted-foreground font-light">Get project files</span>
                        </div>
                      </Button>
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link href={project.githubUrl} target="_blank">
                      <Button className="w-full justify-start h-16 bg-background/60 border border-white/20 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 transition-all duration-500 hover:scale-105 hover:shadow-lg rounded-2xl" variant="outline" size="lg">
                        <div className="p-2 bg-primary/10 rounded-xl mr-4">
                          <Github className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-lg text-foreground">Source Code</span>
                          <span className="text-sm text-muted-foreground font-light">View on GitHub</span>
                        </div>
                      </Button>
                    </Link>
                  )}
                  {project.youtubeUrl && (
                    <Link href={project.youtubeUrl} target="_blank">
                      <Button className="w-full justify-start h-16 bg-background/60 border border-white/20 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/5 hover:border-red-500/30 transition-all duration-500 hover:scale-105 hover:shadow-lg rounded-2xl" variant="outline" size="lg">
                        <div className="p-2 bg-red-500/10 rounded-xl mr-4">
                          <Youtube className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-lg text-foreground">YouTube</span>
                          <span className="text-sm text-muted-foreground font-light">Full video guide</span>
                        </div>
                      </Button>
                    </Link>
                  )}
                  {!project.demoUrl && !project.downloadUrl && !project.githubUrl && !project.youtubeUrl && (
                    <div className="text-center py-12">
                      <div className="p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-3xl border border-white/10 mb-4">
                        <ExternalLink className="h-8 w-8 text-muted-foreground mx-auto" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        No external links available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
