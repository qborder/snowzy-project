"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink, Download, Youtube, Calendar, Code, Gamepad2, Globe, Tag, Sparkles, Clock, Eye, ArrowDown, TrendingUp } from "lucide-react"
import { MarkdownViewer } from "@/components/markdown-editor-enhanced"

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
  titleColor?: string
  titleGradient?: {
    from: string
    to: string
    via?: string
  }
  views?: number
  downloads?: number
}

export default function ProjectViewPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)

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
        
        // Increment view count when project detail page is visited
        try {
          await fetch(`/api/projects/${projectId}/views`, {
            method: 'POST',
          })
        } catch (error) {
          console.error('Failed to increment view count:', error)
        }
        
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

  async function handleDownload() {
    if (!project?.downloadUrl || !project?.id) return
    
    setIsDownloading(true)
    
    try {
      // Increment download counter
      const response = await fetch(`/api/projects/${project.id}/downloads`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        setProject(prev => prev ? { ...prev, downloads: data.downloads } : null)
      }
      
      // Start download
      const link = document.createElement('a')
      link.href = project.downloadUrl
      link.download = ''
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
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
          <div className="bg-gradient-to-br from-background/90 via-background/95 to-background/90 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
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
                  {project.views !== undefined && (
                    <div className="flex items-center gap-2 text-sm bg-background/50 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                      <Eye className="h-3 w-3 text-primary" />
                      <span className="font-medium">{project.views.toLocaleString()} views</span>
                    </div>
                  )}
                  {project.downloads !== undefined && (
                    <div className="flex items-center gap-2 text-sm bg-background/50 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                      <ArrowDown className="h-3 w-3 text-emerald-500" />
                      <span className="font-medium">{project.downloads.toLocaleString()} downloads</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <h1 
                  className={`text-4xl font-black leading-tight tracking-tight ${
                    project.titleGradient 
                      ? 'bg-clip-text text-transparent' 
                      : project.titleColor 
                        ? '' 
                        : 'text-foreground'
                  }`}
                  style={{
                    backgroundImage: project.titleGradient 
                      ? `linear-gradient(to right, ${project.titleGradient.from}${project.titleGradient.via ? `, ${project.titleGradient.via}` : ''}, ${project.titleGradient.to})`
                      : undefined,
                    color: project.titleColor || undefined
                  }}
                >
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


            {project.content && (
              <Card className="bg-background/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-b border-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5 opacity-50"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl"></div>
                  <CardTitle className="flex items-center gap-4 text-xl relative z-10">
                    <div className="p-4 bg-gradient-to-br from-primary/40 via-primary/25 to-primary/15 rounded-2xl border border-primary/30 shadow-lg backdrop-blur-sm">
                      <Code className="h-7 w-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black text-foreground bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">Description</p>
                      <p className="text-sm text-muted-foreground font-medium opacity-80">Comprehensive project documentation and details</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <MarkdownViewer content={project.content} />
                </CardContent>
              </Card>
            )}

            {project.image && (
              <Card className="bg-background/70 backdrop-blur-xl border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group rounded-3xl">
                <CardHeader className="bg-gradient-to-br from-green-500/15 via-green-400/10 to-emerald-500/5 border-b border-green-400/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-emerald-500/5 opacity-50"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/20 to-transparent rounded-full blur-2xl"></div>
                  <CardTitle className="flex items-center gap-4 text-xl relative z-10">
                    <div className="relative group/icon">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-2xl blur opacity-40 group-hover/icon:opacity-60 transition duration-300 animate-pulse"></div>
                      <div className="relative p-4 bg-gradient-to-br from-green-400/40 via-green-400/25 to-emerald-500/15 rounded-2xl border border-green-400/30 shadow-2xl backdrop-blur-sm">
                        <Eye className="h-7 w-7 text-green-400 drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black text-foreground bg-gradient-to-r from-foreground via-green-400 to-foreground bg-clip-text text-transparent leading-tight">Project Preview</p>
                      <p className="text-sm text-muted-foreground font-medium opacity-80">Visual showcase and screenshots</p>
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
              {project.downloadUrl && (
                <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 ease-out group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600/10 dark:bg-blue-500/20 rounded-xl group-hover:bg-blue-600/15 dark:group-hover:bg-blue-500/25 transition-colors duration-300 ease-out">
                        <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 ease-out" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Download Files</h3>
                        <p className="text-sm text-blue-600/70 dark:text-blue-400/70">Source code and assets</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-300 ease-out disabled:opacity-50 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25"
                      size="lg"
                    >
                      {isDownloading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          <span>Downloading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300 ease-out">
                          <Download className="h-4 w-4 group-hover:scale-110 transition-transform duration-300 ease-out" />
                          <span>Download Project</span>
                        </div>
                      )}
                    </Button>
                    
                    <p className="text-xs text-blue-600/60 dark:text-blue-400/60 text-center">
                      {(() => {
                        const url = project.downloadUrl?.toLowerCase() || '';
                        const isArchive = url.includes('.zip') || url.includes('.rar') || url.includes('.7z') || url.includes('.7zip');
                        return isArchive 
                          ? 'ZIP file includes all source files and documentation'
                          : 'Download includes project files and resources';
                      })()}
                    </p>
                  </CardContent>
                </Card>
              )}

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

              <Card className="bg-gradient-to-br from-background/80 via-background/90 to-primary/5 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="p-5 relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative">
                      <div className="p-1.5 bg-gradient-to-br from-primary/40 to-primary/20 rounded-lg border border-primary/30 shadow-md">
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Quick Access</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {project.demoUrl && (
                      <div className="mb-4">
                        <Link href={project.demoUrl} target="_blank">
                          <Button className="w-full justify-start h-16 px-6 py-4 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-primary-foreground group/btn rounded-xl" size="lg">
                            <div className="p-3 bg-white/20 rounded-xl mr-4 group-hover/btn:bg-white/30 transition-colors">
                              <ExternalLink className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col items-start gap-1">
                              <span className="font-bold text-base leading-tight">Live Demo</span>
                              <span className="text-sm opacity-90 font-light leading-tight">Experience it live</span>
                            </div>
                          </Button>
                        </Link>
                      </div>
                    )}
                    {project.githubUrl && (
                      <div className="mb-4">
                        <Link href={project.githubUrl} target="_blank">
                          <Button className="w-full justify-start h-16 px-6 py-4 bg-background/60 border border-white/20 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-xl" variant="outline" size="lg">
                            <div className="p-3 bg-primary/10 rounded-xl mr-4">
                              <Github className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex flex-col items-start gap-1">
                              <span className="font-bold text-base text-foreground leading-tight">Source Code</span>
                              <span className="text-sm text-muted-foreground font-light leading-tight">View on GitHub</span>
                            </div>
                          </Button>
                        </Link>
                      </div>
                    )}
                    {project.youtubeUrl && (
                      <div className="mb-4">
                        <Link href={project.youtubeUrl} target="_blank">
                          <Button className="w-full justify-start h-16 px-6 py-4 bg-background/60 border border-white/20 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-red-500/5 hover:border-red-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-xl" variant="outline" size="lg">
                            <div className="p-3 bg-red-500/10 rounded-xl mr-4">
                              <Youtube className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="flex flex-col items-start gap-1">
                              <span className="font-bold text-base text-foreground leading-tight">YouTube</span>
                              <span className="text-sm text-muted-foreground font-light leading-tight">Full video guide</span>
                            </div>
                          </Button>
                        </Link>
                      </div>
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
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                      <span className="font-medium">
                        {[project.demoUrl, project.githubUrl, project.youtubeUrl].filter(Boolean).length} external links
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
