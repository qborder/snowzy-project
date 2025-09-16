"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Github, ExternalLink, Download, Youtube, Calendar, Code, Gamepad2, Globe, Tag, Sparkles, Clock, Eye, ArrowDown, TrendingUp, Archive, FileCode, Zap, Package, Monitor, ArrowDownRight, Heart, Database, Info } from "lucide-react"
import { MarkdownViewer } from "@/components/markdown-editor-enhanced"
import { Project } from "@/types/project"
import { isFavorite, toggleFavorite } from "@/lib/favorites"


export default function ProjectViewPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [fileSize, setFileSize] = useState<string | null>(null)
  const [favoriteStatus, setFavoriteStatus] = useState(false)

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
        
        // Set initial favorite status
        setFavoriteStatus(isFavorite(projectId))
        
        // Fetch file size if download URL exists
        if (foundProject.downloadUrl) {
          try {
            const filename = foundProject.downloadUrl.split('/').pop()
            if (filename) {
              const fileInfoRes = await fetch(`/api/files/info?filename=${encodeURIComponent(filename)}`)
              if (fileInfoRes.ok) {
                const fileInfo = await fileInfoRes.json()
                if (fileInfo.fileSize) {
                  const sizeInBytes = fileInfo.fileSize
                  if (sizeInBytes < 1024) {
                    setFileSize(`${sizeInBytes} B`)
                  } else if (sizeInBytes < 1024 * 1024) {
                    const sizeInKB = (sizeInBytes / 1024).toFixed(1)
                    setFileSize(`${sizeInKB} KB`)
                  } else {
                    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(1)
                    setFileSize(`${sizeInMB} MB`)
                  }
                }
              }
            }
          } catch (error) {
            console.error('Failed to fetch file size:', error)
          }
        }
        
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

  const handleFavoriteToggle = () => {
    if (project && project.id) {
      const newFavoriteStatus = toggleFavorite(project.id)
      setFavoriteStatus(newFavoriteStatus)
    }
  }

  function getYoutubeEmbedUrl(url: string): string | null {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
    const match = url.match(regex)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  function getFileTypeInfo(url: string) {
    const fileName = url.split('/').pop()?.toLowerCase() || ''
    const extension = fileName.split('.').pop() || ''
    
    if (['zip', 'rar', '7z', '7zip'].includes(extension)) {
      return {
        type: 'archive',
        icon: Archive,
        title: 'Compressed Archive',
        description: 'Complete package with all files',
        details: 'Extract to access all project files and assets',
        color: 'amber',
        bgGradient: 'from-amber-500/15 via-amber-400/10 to-orange-500/10',
        borderColor: 'border-amber-300/30 dark:border-amber-600/30',
        textColor: 'text-amber-600 dark:text-amber-400',
        buttonGradient: 'from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 dark:from-amber-500 dark:to-amber-600 dark:hover:from-amber-600 dark:hover:to-amber-700'
      }
    }
    
    if (['rbxl', 'rbxlx', 'rbxm', 'rbxml', 'rbxmlx'].includes(extension)) {
      return {
        type: 'roblox',
        icon: Download,
        title: 'Download',
        description: 'Project files ready to use',
        details: 'Complete project package with all assets',
        color: 'blue',
        bgGradient: 'from-blue-500/15 via-blue-400/10 to-indigo-500/10',
        borderColor: 'border-blue-300/30 dark:border-blue-600/30',
        textColor: 'text-blue-600 dark:text-blue-400',
        buttonGradient: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700'
      }
    }
    
    if (['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm'].includes(extension)) {
      return {
        type: 'executable',
        icon: Zap,
        title: 'Executable File',
        description: 'Ready to install & run',
        details: 'Double-click to install or run the application',
        color: 'red',
        bgGradient: 'from-red-500/15 via-red-400/10 to-rose-500/10',
        borderColor: 'border-red-300/30 dark:border-red-600/30',
        textColor: 'text-red-600 dark:text-red-400',
        buttonGradient: 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700'
      }
    }
    
    return {
      type: 'file',
      icon: FileCode,
      title: 'Project Files',
      description: 'Source code & assets',
      details: 'Contains all necessary project files',
      color: 'purple',
      bgGradient: 'from-purple-500/15 via-purple-400/10 to-blue-500/10',
      borderColor: 'border-purple-300/30 dark:border-purple-600/30',
      textColor: 'text-purple-600 dark:text-purple-400',
      buttonGradient: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-purple-500 dark:to-purple-600 dark:hover:from-purple-600 dark:hover:to-purple-700'
    }
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

        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-purple-500/8 to-primary/8 rounded-3xl blur-3xl -z-10"></div>
          <div className="bg-gradient-to-br from-background/95 via-background/98 to-background/95 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/15 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-bl from-primary/25 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-500/25 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-primary/35 to-primary/15 rounded-2xl border border-primary/25 shadow-xl">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/25 to-primary/15 text-primary border-primary/35 text-base px-4 py-2 font-semibold shadow-md rounded-xl">
                    {project.category === "Roblox" && <Gamepad2 className="h-4 w-4 mr-2" />}
                    {project.category?.includes("Web") && <Globe className="h-4 w-4 mr-2" />}
                    {project.category?.includes("Mobile") && <Code className="h-4 w-4 mr-2" />}
                    {project.category}
                  </Badge>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      onClick={handleFavoriteToggle}
                      variant="outline"
                      size="sm"
                      className={`group/fav relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                        favoriteStatus 
                          ? 'bg-gradient-to-r from-red-500/15 to-pink-500/10 border-red-500/30 text-red-500 hover:from-red-500/25 hover:to-pink-500/15 hover:border-red-500/50' 
                          : 'bg-background/60 border-white/25 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-500'
                      } backdrop-blur-sm shadow-sm hover:shadow-lg`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover/fav:opacity-100 transition-opacity duration-300" />
                      <Heart 
                        className={`h-4 w-4 mr-2 transition-all duration-300 group-hover/fav:scale-110 relative z-10 ${
                          favoriteStatus ? 'fill-current text-red-500' : ''
                        }`} 
                      />
                      <span className="font-semibold relative z-10">
                        {favoriteStatus ? 'Favorited' : 'Add to Favorites'}
                      </span>
                    </Button>
                    {project.createdAt && (
                      <div className="flex items-center gap-2 text-sm bg-background/60 px-4 py-2 rounded-xl border border-white/25 backdrop-blur-sm shadow-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {project.views !== undefined && (
                      <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-primary/15 to-primary/10 px-4 py-2 rounded-xl border border-primary/30 backdrop-blur-sm shadow-sm">
                        <Eye className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">{project.views.toLocaleString()} views</span>
                      </div>
                    )}
                    {project.downloads !== undefined && (
                      <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-emerald-500/15 to-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30 backdrop-blur-sm shadow-sm">
                        <ArrowDown className="h-4 w-4 text-emerald-500" />
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{project.downloads.toLocaleString()} downloads</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h1 
                  className={`text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-2 ${
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
                
                <div className="space-y-8">
                  <p className="text-foreground/95 text-xl leading-relaxed max-w-5xl font-medium">
                    {project.description}
                  </p>
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full"></div>
                </div>
                
                
              </div>
            </div>
          </div>
        </div>


        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <Tabs defaultValue="about" className="space-y-8">
              <TabsList className="grid w-full grid-cols-2 max-w-md bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-1.5">
                <TabsTrigger 
                  value="about" 
                  className="group relative overflow-hidden data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/30 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-700" />
                  <Info className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110 group-data-[state=active]:animate-pulse" />
                  <span className="relative z-10">About</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="versions" 
                  className="group relative overflow-hidden data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-cyan-400/10 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-400/30 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-700" />
                  <Database className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110 group-data-[state=active]:animate-pulse" />
                  <span className="relative z-10">Versions</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
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
              </TabsContent>

              <TabsContent value="versions" className="space-y-6">
                <Card className="bg-background/70 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-cyan-500/15 via-cyan-400/10 to-cyan-500/5 border-b border-cyan-400/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-400/5 opacity-50"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-full blur-2xl"></div>
                    <CardTitle className="flex items-center gap-4 text-xl relative z-10">
                      <div className="p-4 bg-gradient-to-br from-cyan-500/40 via-cyan-400/25 to-cyan-500/15 rounded-2xl border border-cyan-400/30 shadow-lg backdrop-blur-sm">
                        <Database className="h-7 w-7 text-cyan-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-black text-foreground bg-gradient-to-r from-foreground via-cyan-400 to-foreground bg-clip-text text-transparent leading-tight">Release History</p>
                        <p className="text-sm text-muted-foreground font-medium opacity-80">All versions and updates for this project</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {/* Version entries */}
                      <div className="space-y-4">
                        <div className="p-6 rounded-xl border border-white/10 bg-background/30 hover:bg-background/50 transition-all duration-300 group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <Badge className="bg-green-500/10 text-green-400 border-green-400/20 px-3 py-1">
                                <span className="mr-1">✅</span>
                                stable
                              </Badge>
                              <div>
                                <h3 className="font-mono text-lg font-bold text-foreground">v1.2.1</h3>
                                <p className="text-sm text-muted-foreground">Latest Release</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">2 days ago</p>
                              <p className="text-xs text-muted-foreground/80">March 14, 2024</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-lg text-foreground">Security Update & Bug Fixes</h4>
                            <div className="prose prose-sm max-w-none text-muted-foreground">
                              <p>This release focuses on security improvements and critical bug fixes:</p>
                              <ul className="list-disc list-inside space-y-1 mt-2">
                                <li>Fixed critical security vulnerability in authentication system</li>
                                <li>Improved error handling throughout the application</li>
                                <li>Enhanced performance optimizations for large datasets</li>
                                <li>Updated dependencies to latest secure versions</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm">
                              <Download className="h-4 w-4 text-emerald-500" />
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">157 downloads</span>
                            </div>
                            <Button variant="outline" size="sm" className="ml-auto">
                              <Download className="h-3 w-3 mr-1.5" />
                              Download
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-6 rounded-xl border border-white/10 bg-background/30 hover:bg-background/50 transition-all duration-300 group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <Badge className="bg-blue-500/10 text-blue-400 border-blue-400/20 px-3 py-1">
                                <span className="mr-1">🚧</span>
                                beta
                              </Badge>
                              <div>
                                <h3 className="font-mono text-lg font-bold text-foreground">v1.3.0-beta.2</h3>
                                <p className="text-sm text-muted-foreground">Pre-release</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">1 week ago</p>
                              <p className="text-xs text-muted-foreground/80">March 7, 2024</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-lg text-foreground">New UI Components & Dark Mode</h4>
                            <div className="prose prose-sm max-w-none text-muted-foreground">
                              <p>Major UI overhaul with new features and improvements:</p>
                              <ul className="list-disc list-inside space-y-1 mt-2">
                                <li>Complete dark mode implementation with theme switching</li>
                                <li>New dashboard components and layouts</li>
                                <li>Improved accessibility features and keyboard navigation</li>
                                <li>Enhanced mobile responsiveness</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm">
                              <Download className="h-4 w-4 text-emerald-500" />
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">43 downloads</span>
                            </div>
                            <Button variant="outline" size="sm" className="ml-auto">
                              <Download className="h-3 w-3 mr-1.5" />
                              Download
                            </Button>
                          </div>
                        </div>
                        
                        <div className="p-6 rounded-xl border border-white/10 bg-background/30 hover:bg-background/50 transition-all duration-300 group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <Badge className="bg-green-500/10 text-green-400 border-green-400/20 px-3 py-1">
                                <span className="mr-1">✅</span>
                                stable
                              </Badge>
                              <div>
                                <h3 className="font-mono text-lg font-bold text-foreground">v1.2.0</h3>
                                <p className="text-sm text-muted-foreground">Major Release</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">3 weeks ago</p>
                              <p className="text-xs text-muted-foreground/80">February 22, 2024</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-lg text-foreground">Feature-Rich Update</h4>
                            <div className="prose prose-sm max-w-none text-muted-foreground">
                              <p>Introducing powerful new features and improvements:</p>
                              <ul className="list-disc list-inside space-y-1 mt-2">
                                <li>Advanced search and filtering capabilities</li>
                                <li>Real-time collaboration features</li>
                                <li>Export functionality for multiple formats</li>
                                <li>Performance improvements and bug fixes</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2 text-sm">
                              <Download className="h-4 w-4 text-emerald-500" />
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">289 downloads</span>
                            </div>
                            <Button variant="outline" size="sm" className="ml-auto">
                              <Download className="h-3 w-3 mr-1.5" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground">
                          More versions available • Total downloads: <span className="font-semibold text-foreground">489</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8 space-y-6">
              {project.downloadUrl && (() => {
                const fileInfo = getFileTypeInfo(project.downloadUrl)
                const IconComponent = fileInfo.icon
                
                return (
                  <Card className={`bg-gradient-to-br from-background/80 via-background/90 to-background/95 backdrop-blur-xl border ${fileInfo.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden rounded-2xl relative`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${fileInfo.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl"></div>
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="space-y-5">
                        <div className="text-center">
                          <div className="relative mb-4">
                            <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${fileInfo.bgGradient} rounded-2xl border ${fileInfo.borderColor} shadow-lg`}>
                              <IconComponent className={`h-8 w-8 ${fileInfo.textColor}`} />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-primary to-purple-500 rounded-full animate-pulse"></div>
                          </div>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
                            {fileInfo.title}
                          </h3>
                          <p className="text-sm text-muted-foreground font-medium mb-1">
                            {fileInfo.description}
                          </p>
                          <p className="text-xs text-muted-foreground/80 font-medium">
                            {fileInfo.details}
                          </p>
                        </div>
                        
                        <div className="bg-background/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-muted-foreground">File Type</span>
                            </div>
                            <span className={`font-bold ${fileInfo.textColor} capitalize`}>
                              {fileInfo.type === 'archive' ? 'Archive' : 
                               fileInfo.type === 'roblox' ? 'Project' : 
                               fileInfo.type === 'executable' ? 'Executable' : 'Source Code'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-white/10">
                            <div className="flex items-center gap-2">
                              <Archive className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-muted-foreground">File Size</span>
                            </div>
                            <span className="font-bold text-muted-foreground">
                              {fileSize || 'Loading...'}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleDownload}
                          disabled={isDownloading}
                          className={`w-full h-14 bg-gradient-to-br ${fileInfo.buttonGradient} text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border-0 relative overflow-hidden group/btn text-lg`}
                          size="lg"
                        >
                          <span className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
                          {isDownloading ? (
                            <div className="flex items-center gap-3 relative z-10">
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                              <span>Preparing download...</span>
                              <div className="ml-2 flex gap-1">
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 relative z-10">
                              <ArrowDownRight className="h-5 w-5 transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:translate-y-1" />
                              <span>Download {fileInfo.type === 'archive' ? 'Archive' : fileInfo.type === 'roblox' ? 'Project' : fileInfo.type === 'executable' ? 'Installer' : 'Project'}</span>
                            </div>
                          )}
                        </Button>
                        
                        
                        {fileInfo.type === 'archive' && (
                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-amber-500/20 rounded-lg">
                                <Archive className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-semibold text-amber-700 dark:text-amber-300 text-sm">Extract Required</h4>
                                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 leading-relaxed">
                                  Right-click → Extract All → Choose destination folder
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {fileInfo.type === 'executable' && (
                          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-red-500/20 rounded-lg">
                                <Zap className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-semibold text-red-700 dark:text-red-300 text-sm">Installation</h4>
                                <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed">
                                  Run as administrator if needed → Follow setup wizard
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="text-center pt-2">
                          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                            <span>Free • No registration required • Instant download</span>
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()}

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

              <div className="group/links relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 via-orange-400/30 to-amber-500/30 rounded-2xl blur-lg opacity-0 group-hover/links:opacity-100 transition-all duration-700"></div>
                <Card className="relative bg-gradient-to-br from-background/95 via-background/98 to-orange-500/5 backdrop-blur-2xl border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-700 rounded-2xl overflow-hidden hover:scale-[1.02] hover:border-orange-500/50">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/8 via-transparent to-red-500/8 opacity-60"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
                  
                  <CardContent className="p-7 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative group/icon">
                        <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-xl blur-md opacity-0 group-hover/icon:opacity-100 transition-all duration-500"></div>
                        <div className="relative p-3 bg-gradient-to-br from-orange-500/30 via-red-500/20 to-orange-500/15 rounded-xl border border-orange-500/40 shadow-lg group-hover/icon:scale-110 transition-all duration-500">
                          <ExternalLink className="h-5 w-5 text-orange-500" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black bg-gradient-to-r from-foreground via-orange-500 to-amber-500 bg-clip-text text-transparent">Quick Access</h3>
                        <p className="text-sm text-muted-foreground/80 font-medium">External links and resources</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {project.demoUrl && (
                        <div className="group/demo relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover/demo:opacity-100 transition-all duration-500"></div>
                          <Link href={project.demoUrl} target="_blank">
                            <Button className="relative w-full justify-start h-18 px-8 py-6 bg-gradient-to-r from-primary via-primary/90 to-blue-500 hover:from-primary/90 hover:via-primary/80 hover:to-blue-500/90 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] text-primary-foreground group/btn rounded-2xl" size="lg">
                              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                              <div className="p-4 bg-white/25 rounded-xl mr-6 group-hover/btn:bg-white/35 transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:rotate-3">
                                <ExternalLink className="h-6 w-6" />
                              </div>
                              <div className="flex flex-col items-start gap-1 relative z-10">
                                <span className="font-bold text-lg leading-tight">Live Demo</span>
                                <span className="text-sm opacity-90 font-medium leading-tight">Experience the project live</span>
                              </div>
                            </Button>
                          </Link>
                        </div>
                      )}
                      {project.githubUrl && (
                        <div className="group/github relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500/20 to-slate-500/20 rounded-2xl blur opacity-0 group-hover/github:opacity-100 transition-all duration-500"></div>
                          <Link href={project.githubUrl} target="_blank">
                            <Button className="relative w-full justify-start h-18 px-8 py-6 bg-gradient-to-br from-background/80 via-background/90 to-gray-500/10 border border-white/30 hover:bg-gradient-to-r hover:from-gray-500/15 hover:to-slate-500/10 hover:border-gray-500/50 transition-all duration-500 hover:scale-[1.03] hover:shadow-xl rounded-2xl" variant="outline" size="lg">
                              <div className="p-4 bg-gray-500/15 rounded-xl mr-6 transition-all duration-500 hover:bg-gray-500/25 hover:scale-110">
                                <Github className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div className="flex flex-col items-start gap-1">
                                <span className="font-bold text-lg text-foreground leading-tight">Source Code</span>
                                <span className="text-sm text-muted-foreground font-medium leading-tight">View on GitHub</span>
                              </div>
                            </Button>
                          </Link>
                        </div>
                      )}
                      {project.youtubeUrl && (
                        <div className="group/youtube relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover/youtube:opacity-100 transition-all duration-500"></div>
                          <Link href={project.youtubeUrl} target="_blank">
                            <Button className="relative w-full justify-start h-18 px-8 py-6 bg-gradient-to-br from-background/80 via-background/90 to-red-500/10 border border-white/30 hover:bg-gradient-to-r hover:from-red-500/15 hover:to-pink-500/10 hover:border-red-500/50 transition-all duration-500 hover:scale-[1.03] hover:shadow-xl rounded-2xl" variant="outline" size="lg">
                              <div className="p-4 bg-red-500/15 rounded-xl mr-6 transition-all duration-500 hover:bg-red-500/25 hover:scale-110">
                                <Youtube className="h-6 w-6 text-red-500" />
                              </div>
                              <div className="flex flex-col items-start gap-1">
                                <span className="font-bold text-lg text-foreground leading-tight">YouTube</span>
                                <span className="text-sm text-muted-foreground font-medium leading-tight">Full video tutorial</span>
                              </div>
                            </Button>
                          </Link>
                        </div>
                      )}
                      {!project.demoUrl && !project.downloadUrl && !project.githubUrl && !project.youtubeUrl && (
                        <div className="text-center py-16">
                          <div className="relative group/empty">
                            <div className="absolute -inset-4 bg-gradient-to-r from-muted/20 to-muted/10 rounded-3xl blur-lg opacity-0 group-hover/empty:opacity-100 transition-all duration-700"></div>
                            <div className="relative p-8 bg-gradient-to-br from-muted/40 to-muted/15 rounded-3xl border border-white/20 mb-6 group-hover/empty:scale-105 transition-all duration-500">
                              <ExternalLink className="h-12 w-12 text-muted-foreground mx-auto" />
                            </div>
                          </div>
                          <p className="text-base text-muted-foreground font-semibold mb-2">
                            No external links available
                          </p>
                          <p className="text-sm text-muted-foreground/70">
                            Check back later for updates
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                        <span className="text-sm text-muted-foreground font-semibold">
                          {[project.demoUrl, project.githubUrl, project.youtubeUrl].filter(Boolean).length} external links available
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
    </div>
  )
}
