"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink, Download, Youtube, Calendar, Code, Gamepad2, Globe, Tag, Sparkles, Clock, Eye, ArrowDown, TrendingUp, Star, Users, Activity } from "lucide-react"
import { MarkdownViewer } from "@/components/markdown-editor-enhanced"
import { DownloadModal } from "@/components/download-modal"

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
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)

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

  function handleDownloadClick() {
    setIsDownloadModalOpen(true)
  }

  function handleDownloadComplete(newDownloadCount: number) {
    setProject(prev => prev ? { ...prev, downloads: newDownloadCount } : null)
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

          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8 space-y-6">
              {project.downloadUrl && (
                <Card className="bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 ease-out group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-blue-600/20 to-blue-500/10 rounded-xl group-hover:from-blue-600/25 group-hover:to-blue-500/15 transition-all duration-300 ease-out border border-blue-500/20">
                        <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 ease-out" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-100 dark:to-blue-300 bg-clip-text text-transparent">Download Project</h3>
                        <p className="text-sm text-blue-600/70 dark:text-blue-400/70 font-medium">Get the complete source code</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <Star className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">Premium</div>
                        <div className="text-xs text-blue-600/70 dark:text-blue-400/70">Quality</div>
                      </div>
                      <div className="text-center p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <Users className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{project.downloads?.toLocaleString() || 0}</div>
                        <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">Downloads</div>
                      </div>
                      <div className="text-center p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <Activity className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                        <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">Active</div>
                        <div className="text-xs text-purple-600/70 dark:text-purple-400/70">Project</div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleDownloadClick}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white rounded-xl font-bold transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 border-0 shadow-md"
                      size="lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/20 rounded-lg">
                          <Download className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-sm leading-tight">Download Now</div>
                          <div className="text-xs opacity-90 font-normal leading-tight">Get full access</div>
                        </div>
                      </div>
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-xs text-blue-600/60 dark:text-blue-400/60 font-medium">
                        ✨ Includes source code, assets & documentation
                      </p>
                    </div>
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
      
      {project && (
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          project={project}
          onDownloadComplete={handleDownloadComplete}
        />
      )}
    </div>
  )
}
