"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { Badge } from "@/components/ui/badge"
import { GradientPicker } from "@/components/ui/gradient-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Sparkles, Code, Gamepad2, Globe, X, ImageIcon, Palette, Edit, ExternalLink, Eye, Tag } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { ProjectEditor } from "@/components/project-editor"
import { MarkdownEditorEnhanced } from "@/components/markdown-editor-enhanced"

const DEFAULT_TEMPLATES = {
  roblox: {
    title: "Roblox Game Template",
    description: "An exciting Roblox experience with engaging gameplay mechanics and stunning visuals.",
    category: "Roblox",
    tags: ["Roblox", "Lua", "Game Development", "Scripting"]
  },
  robloxKit: {
    title: "Roblox Kit/System",
    description: "A reusable Roblox kit or system template for developers to integrate into their games.",
    category: "Roblox",
    tags: ["Roblox", "Kit", "Template", "Roblox Studio", "Lua", "System"]
  },
  robloxPlugin: {
    title: "Roblox Studio Plugin",
    description: "A powerful plugin for Roblox Studio to enhance development workflow and productivity.",
    category: "Roblox",
    tags: ["Roblox Studio", "Plugin", "Development Tool", "Lua", "Automation"]
  },
  web: {
    title: "Web App Template",
    description: "A modern web application built with the latest technologies and best practices.",
    category: "Web Development",
    tags: ["React", "TypeScript", "Tailwind CSS", "Next.js"]
  },
  mobile: {
    title: "Mobile App Template",
    description: "A cross-platform mobile application with native performance and beautiful UI.",
    category: "Mobile Development",
    tags: ["React Native", "Mobile", "Cross-platform", "UI/UX"]
  }
}

const SUGGESTED_TAGS = [
  "Roblox", "Roblox Studio", "Kit", "Template", "Lua", "Game Development", "Plugin",
  "System", "Model", "Asset", "Scripting", "Admin Commands", "Anti-Exploit", "UI Kit",
  "Simulator", "RPG", "FPS", "Racing", "Obby", "Tycoon", "Building Tools",
  "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js", "Express",
  "3D Modeling", "Animation", "VFX", "Particles", "Lighting", "Terrain",
  "Mobile", "React Native", "Flutter", "Swift", "Kotlin", "Cross-platform",
  "UI/UX", "Design", "Figma", "Responsive", "Accessibility", "SEO"
]

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
  icon?: string
  tags: string[]
  createdAt?: string
  cardGradient?: string
  cardColor?: string
  content?: string
  titleColor?: string
  titleGradient?: {
    from: string
    to: string
    via?: string
  }
}

type CustomTemplate = {
  title: string
  description: string
  category: string
  tags: string[]
  cardGradient?: string
  cardColor?: string
}

export default function DevProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab')
    return tab === 'editor' ? 'editor' : 'creator'
  })
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [downloadUrl, setDownloadUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [demoUrl, setDemoUrl] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [image, setImage] = useState("")
  const [icon, setIcon] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState("")
  const [cardGradient, setCardGradient] = useState("")
  const [cardColor, setCardColor] = useState("")
  const [useCustomStyle, setUseCustomStyle] = useState(false)
  const [titleColor, setTitleColor] = useState("")
  const [titleGradientFrom, setTitleGradientFrom] = useState("")
  const [titleGradientTo, setTitleGradientTo] = useState("")
  const [titleGradientVia, setTitleGradientVia] = useState("")
  const [useTitleCustomStyle, setUseTitleCustomStyle] = useState(false)
  const [customTemplates, setCustomTemplates] = useState<Record<string, CustomTemplate>>({})
  const [templateName, setTemplateName] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const iconFileInputRef = useRef<HTMLInputElement>(null)
  const downloadFileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState("")
  const [previewReduce, setPreviewReduce] = useState(true)
  const [previewSize, setPreviewSize] = useState<"sm" | "md" | "lg">("md")

  // Auto-save functionality - saves EVERYTHING
  useEffect(() => {
    if (!title && !description && !category && !content && tags.length === 0 && !image && !icon && !downloadUrl && !githubUrl && !demoUrl && !youtubeUrl && !editingProject) {
      return // Don't save completely empty state
    }
    
    const draft = {
      // Form fields
      title, description, category, downloadUrl, githubUrl, demoUrl, youtubeUrl, image, icon, tags, content,
      // Styling
      cardGradient, cardColor, useCustomStyle, titleColor, titleGradientFrom, titleGradientTo, titleGradientVia, useTitleCustomStyle,
      // UI State
      activeTab, editingProjectId, editingProject, templateName, tagInput,
      // Preview
      previewReduce, previewSize,
      // Timestamp
      timestamp: Date.now()
    }
    
    localStorage.setItem('projectDraft', JSON.stringify(draft))
    setAutoSaveStatus("Draft saved")
    
    const timer = setTimeout(() => setAutoSaveStatus(""), 2000)
    return () => clearTimeout(timer)
  }, [title, description, category, downloadUrl, githubUrl, demoUrl, youtubeUrl, image, icon, tags, content, cardGradient, cardColor, useCustomStyle, titleColor, titleGradientFrom, titleGradientTo, titleGradientVia, useTitleCustomStyle, activeTab, editingProjectId, editingProject, templateName, tagInput, previewReduce, previewSize])

  function handleTabChange(value: string) {
    setActiveTab(value)
    const url = new URL(window.location.href)
    if (value === 'editor') {
      url.searchParams.set('tab', 'editor')
    } else {
      url.searchParams.delete('tab')
    }
    router.replace(url.pathname + url.search, { scroll: false })
  }

  function startEditingProject(projectId: string, project: Project) {
    setEditingProject(project)
    setEditingProjectId(projectId)
    setTitle(project.title || "")
    setDescription(project.description || "")
    setCategory(project.category || "")
    setDownloadUrl(project.downloadUrl || "")
    setGithubUrl(project.githubUrl || "")
    setDemoUrl(project.demoUrl || "")
    setYoutubeUrl(project.youtubeUrl || "")
    setImage(project.image || "")
    setIcon(project.icon || "")
    setTags(project.tags || [])
    setContent(project.content || "")
    setCardGradient(project.cardGradient || "")
    setCardColor(project.cardColor || "")
    setUseCustomStyle(!!(project.cardGradient || project.cardColor))
    setTitleColor(project.titleColor || "")
    setTitleGradientFrom(project.titleGradient?.from || "")
    setTitleGradientTo(project.titleGradient?.to || "")
    setTitleGradientVia(project.titleGradient?.via || "")
    setUseTitleCustomStyle(!!(project.titleColor || project.titleGradient))
    setActiveTab('creator')
    const url = new URL(window.location.href)
    url.searchParams.delete('tab')
    url.searchParams.set('id', projectId)
    router.replace(url.pathname + url.search, { scroll: false })
  }

  useEffect(() => {
    // Load auto-saved draft - restores EVERYTHING
    const draft = localStorage.getItem('projectDraft')
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        
        // Form fields
        setTitle(parsed.title || "")
        setDescription(parsed.description || "")
        setCategory(parsed.category || "")
        setDownloadUrl(parsed.downloadUrl || "")
        setGithubUrl(parsed.githubUrl || "")
        setDemoUrl(parsed.demoUrl || "")
        setYoutubeUrl(parsed.youtubeUrl || "")
        setImage(parsed.image || "")
        setIcon(parsed.icon || "")
        setTags(parsed.tags || [])
        setContent(parsed.content || "")
        
        // Styling
        setCardGradient(parsed.cardGradient || "")
        setCardColor(parsed.cardColor || "")
        setUseCustomStyle(parsed.useCustomStyle || false)
        setTitleColor(parsed.titleColor || "")
        setTitleGradientFrom(parsed.titleGradientFrom || "")
        setTitleGradientTo(parsed.titleGradientTo || "")
        setTitleGradientVia(parsed.titleGradientVia || "")
        setUseTitleCustomStyle(parsed.useTitleCustomStyle || false)
        
        // UI State
        if (parsed.activeTab) setActiveTab(parsed.activeTab)
        if (parsed.editingProjectId) setEditingProjectId(parsed.editingProjectId)
        if (parsed.editingProject) setEditingProject(parsed.editingProject)
        if (parsed.templateName) setTemplateName(parsed.templateName)
        if (parsed.tagInput) setTagInput(parsed.tagInput)
        // Preview
        if (typeof parsed.previewReduce === 'boolean') setPreviewReduce(parsed.previewReduce)
        if (parsed.previewSize) setPreviewSize(parsed.previewSize)
        
        
        // Update URL if we're in editing mode
        if (parsed.editingProjectId && parsed.activeTab === 'creator') {
          const url = new URL(window.location.href)
          url.searchParams.set('id', parsed.editingProjectId)
          router.replace(url.pathname + url.search, { scroll: false })
        } else if (parsed.activeTab === 'editor') {
          const url = new URL(window.location.href)
          url.searchParams.set('tab', 'editor')
          router.replace(url.pathname + url.search, { scroll: false })
        }
        
        console.log('Draft restored with full state:', {
          editingMode: !!parsed.editingProjectId,
          activeTab: parsed.activeTab,
          hasContent: !!(parsed.title || parsed.description)
        })
        
      } catch (e) {
        console.warn('Failed to load draft:', e)
      }
    }
    
    // Load custom templates separately (not part of draft system)
    const saved = localStorage.getItem('customTemplates')
    if (saved) {
      setCustomTemplates(JSON.parse(saved))
    }
  }, [router])

  function addTag(tag: string) {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setTagInput("")
  }

  function removeTag(tagToRemove: string) {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  function handleTagKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(tagInput.trim())
    }
  }

  function applyTemplate(template: CustomTemplate) {
    setTitle(template.title)
    setDescription(template.description)
    setCategory(template.category)
    setTags(template.tags)
    if (template.cardGradient) {
      setCardGradient(template.cardGradient)
      setUseCustomStyle(true)
    }
    if (template.cardColor) {
      setCardColor(template.cardColor)
      setUseCustomStyle(true)
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    if (!imageFile) return
    try {
      setUploading(true)
      setResult("")
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(imageFile.name)}`, { 
        method: "POST", 
        body: imageFile 
      })
      const data = await res.json()
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed")
      }
      setImage(data.url)
      setResult("Image uploaded successfully")
    } catch (err: unknown) {
      const error = err as Error
      setResult(error.message || "Upload error")
    } finally {
      setUploading(false)
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    try {
      setUploading(true)
      setResult("")
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { 
        method: "POST", 
        body: file 
      })
      const data = await res.json()
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed")
      }
      setImage(data.url)
      setResult("Image uploaded successfully")
    } catch (err: unknown) {
      const error = err as Error
      setResult(error.message || "Upload error")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleIconFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    try {
      setUploading(true)
      setResult("")
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { 
        method: "POST", 
        body: file 
      })
      const data = await res.json()
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed")
      }
      setIcon(data.url)
      setResult("Icon uploaded successfully")
    } catch (err: unknown) {
      const error = err as Error
      setResult(error.message || "Upload error")
    } finally {
      setUploading(false)
      if (iconFileInputRef.current) iconFileInputRef.current.value = ""
    }
  }

  async function handleDownloadFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      setResult("")
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { 
        method: "POST", 
        body: file 
      })
      const data = await res.json()
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload failed")
      }
      setDownloadUrl(data.url)
      setResult("File uploaded successfully")
    } catch (err: unknown) {
      const error = err as Error
      setResult(error.message || "Upload error")
    } finally {
      setUploading(false)
      if (downloadFileInputRef.current) downloadFileInputRef.current.value = ""
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave() {
    setDragActive(false)
  }

  function getMissingRequired() {
    const missing: string[] = []
    if (!title.trim()) missing.push("title")
    if (!description.trim()) missing.push("description")
    if (!category.trim()) missing.push("category")
    if (tags.length === 0) missing.push("tags[]")
    return missing
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setResult("")
    const missing = getMissingRequired()
    if (missing.length) {
      setSaving(false)
      setResult(`Missing required fields: ${missing.join(", ")}`)
      return
    }
    const body: Partial<Project> = { title, description, category, downloadUrl, githubUrl, demoUrl, youtubeUrl, image, icon, tags, content }
    if (useCustomStyle && (cardGradient || cardColor)) {
      body.cardGradient = cardGradient
      body.cardColor = cardColor
    }
    if (useTitleCustomStyle) {
      if (titleColor) {
        body.titleColor = titleColor
      }
      if (titleGradientFrom && titleGradientTo) {
        body.titleGradient = {
          from: titleGradientFrom,
          to: titleGradientTo,
          via: titleGradientVia || undefined
        }
      }
    }
    try {
      if (editingProject && editingProjectId) {
        const response = await fetch('/api/projects')
        const projects = await response.json()
        const projectIndex = projects.findIndex((p: Record<string, unknown>) => p.id === editingProjectId)
        if (projectIndex !== -1) {
          projects[projectIndex] = { ...projects[projectIndex], ...body }
          const updateResponse = await fetch('/api/projects', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projects)
          })
          if (!updateResponse.ok) {
            const t = await updateResponse.text()
            throw new Error(t || "Update failed")
          }
          setResult("Project updated successfully!")
          localStorage.removeItem('projectDraft') // Clear draft after successful update
        } else {
          throw new Error("Project not found for update")
        }
      } else {
        const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        if (!res.ok) {
          const t = await res.text()
          throw new Error(t || "Failed")
        }
        setResult("Project created successfully!")
        
        // Clear form and remove draft
        localStorage.removeItem('projectDraft')
        setTitle("")
        setDescription("")
        setCategory("")
        setDownloadUrl("")
        setGithubUrl("")
        setDemoUrl("")
        setYoutubeUrl("")
        setImage("")
        setIcon("")
        setTags([])
        setContent("")
        setCardGradient("")
        setCardColor("")
        setUseCustomStyle(false)
        setTitleColor("")
        setTitleGradientFrom("")
        setTitleGradientTo("")
        setTitleGradientVia("")
        setUseTitleCustomStyle(false)
      }
    } catch (err: unknown) {
      const error = err as Error
      setResult(error.message || "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto max-w-7xl py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 shadow-lg">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">Project Management Studio</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Create stunning project showcases with advanced customization tools and live preview</p>
        </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-1.5">
          <TabsTrigger value="creator" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/30 rounded-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-700" />
            <Sparkles className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110 group-data-[state=active]:animate-pulse" />
            <span className="relative z-10">Project Creator</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary/30 rounded-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-700" />
            <Edit className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110 group-data-[state=active]:animate-pulse" />
            <span className="relative z-10">Project Editor</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="creator" className="space-y-6">
          {editingProject && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
                    <div>
                      <p className="font-semibold text-primary">Editing Project: {editingProject.title}</p>
                      <p className="text-sm text-muted-foreground">Make your changes and click &quot;Update Project&quot; to save</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setTitle("")
                      setDescription("")
                      setCategory("")
                      setDownloadUrl("")
                      setGithubUrl("")
                      setDemoUrl("")
                      setYoutubeUrl("")
                      setImage("")
                      setIcon("")
                      setTags([])
                      setContent("")
                      setCardGradient("")
                      setCardColor("")
                      setUseCustomStyle(false)
                      setTitleColor("")
                      setTitleGradientFrom("")
                      setTitleGradientTo("")
                      setTitleGradientVia("")
                      setUseTitleCustomStyle(false)
                      setPreviewReduce(true)
                      setPreviewSize('md')
                      setEditingProject(null)
                      setEditingProjectId(null)
                      const url = new URL(window.location.href)
                      url.searchParams.delete('id')
                      router.replace(url.pathname + url.search, { scroll: false })
                    }}
                  >
                    Exit Edit Mode
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
      
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Tabs defaultValue="basic" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-lg">
              <TabsTrigger value="basic" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary/15 data-[state=active]:to-primary/8 data-[state=active]:text-primary rounded-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-500" />
                <Sparkles className="h-4 w-4 mr-1 transition-all duration-200 group-hover:scale-110 group-data-[state=active]:text-primary" />
                <span className="relative z-10">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="links" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500/15 data-[state=active]:to-blue-400/8 data-[state=active]:text-blue-400 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-blue-400/5 to-blue-400/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-500" />
                <ExternalLink className="h-4 w-4 mr-1 transition-all duration-200 group-hover:scale-110 group-data-[state=active]:text-blue-400" />
                <span className="relative z-10">Links</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-500/15 data-[state=active]:to-green-400/8 data-[state=active]:text-green-400 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 via-green-400/5 to-green-400/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-500" />
                <ImageIcon className="h-4 w-4 mr-1 transition-all duration-200 group-hover:scale-110 group-data-[state=active]:text-green-400" />
                <span className="relative z-10">Media</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/15 data-[state=active]:to-purple-400/8 data-[state=active]:text-purple-400 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 via-purple-400/5 to-purple-400/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-500" />
                <Code className="h-4 w-4 mr-1 transition-all duration-200 group-hover:scale-110 group-data-[state=active]:text-purple-400" />
                <span className="relative z-10">Page</span>
              </TabsTrigger>
              <TabsTrigger value="style" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-500/15 data-[state=active]:to-pink-400/8 data-[state=active]:text-pink-400 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/0 via-pink-400/5 to-pink-400/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-500" />
                <Palette className="h-4 w-4 mr-1 transition-all duration-200 group-hover:scale-110 group-data-[state=active]:text-pink-400" />
                <span className="relative z-10">Style</span>
              </TabsTrigger>
              <TabsTrigger value="templates" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500/15 data-[state=active]:to-orange-400/8 data-[state=active]:text-orange-400 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/0 via-orange-400/5 to-orange-400/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-500" />
                <Sparkles className="h-4 w-4 mr-1 transition-all duration-200 group-hover:scale-110 group-data-[state=active]:text-orange-400" />
                <span className="relative z-10">Templates</span>
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={onSubmit}>
              <TabsContent value="basic" className="space-y-6">
                <Card className="bg-background/60 backdrop-blur-sm border-white/10 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-white/10">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">Project Details</p>
                        <p className="text-sm text-muted-foreground font-normal">Essential information about your project</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Project Title</label>
                      <EnhancedInput value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Project" className="text-lg" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        placeholder="Describe what makes your project special..." 
                        className="w-full rounded-lg border border-white/20 bg-background/60 backdrop-blur-sm p-4 min-h-[120px] resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Category</label>
                      <div className="flex gap-2 mb-2">
                        {["Roblox", "Roblox Studio", "Web Development", "Mobile Development", "Game Development"].map(cat => (
                          <Badge 
                            key={cat}
                            variant={category === cat ? "default" : "outline"}
                            className="cursor-pointer transition-colors hover:bg-primary/20"
                            onClick={() => setCategory(cat)}
                          >
                            {(cat === "Roblox" || cat === "Roblox Studio") && <Gamepad2 className="h-3 w-3 mr-1" />}
                            {cat.includes("Web") && <Globe className="h-3 w-3 mr-1" />}
                            {cat.includes("Mobile") && <Code className="h-3 w-3 mr-1" />}
                            {cat}
                          </Badge>
                        ))}
                      </div>
                      <EnhancedInput value={category} onChange={e => setCategory(e.target.value)} placeholder="Or enter custom category" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-background/60 backdrop-blur-sm border-white/10 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-white/10">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">Technologies & Tags</p>
                        <p className="text-sm text-muted-foreground font-normal">Help others discover your project</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="group cursor-pointer">
                            {tag}
                            <X className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeTag(tag)} />
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <EnhancedInput 
                          value={tagInput} 
                          onChange={e => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyPress}
                          placeholder="Add tags (press Enter or comma)" 
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" className="group relative overflow-hidden bg-gradient-to-r from-background/90 to-background/70 hover:from-primary/10 hover:to-primary/5 border border-primary/20 hover:border-primary/40 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105" onClick={() => addTag(tagInput.trim())}>
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                          <span className="relative z-10">Add</span>
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Quick add:</p>
                      <div className="flex flex-wrap gap-1">
                        {SUGGESTED_TAGS.filter(tag => !tags.includes(tag)).slice(0, 8).map(tag => (
                          <Badge key={tag} variant="outline" className="cursor-pointer text-xs hover:bg-primary/10" onClick={() => addTag(tag)}>
                            + {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              
              <TabsContent value="links" className="space-y-6">
                <Card className="bg-background/60 backdrop-blur-sm border-white/10 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-white/10">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
                        <ExternalLink className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">Project Links</p>
                        <p className="text-sm text-muted-foreground font-normal">Connect your project resources</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">GitHub Repository</label>
                      <EnhancedInput value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="https://github.com/username/repo" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Live Demo</label>
                      <EnhancedInput value={demoUrl} onChange={e => setDemoUrl(e.target.value)} placeholder="https://your-project.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Download Link</label>
                      <div className="flex gap-2">
                        <EnhancedInput value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} placeholder="https://releases.com/download" className="flex-1" />
                        <input ref={downloadFileInputRef} type="file" onChange={handleDownloadFileSelect} className="hidden" />
                        <Button type="button" variant="outline" className="group relative overflow-hidden bg-gradient-to-r from-background/90 to-background/70 hover:from-blue-500/10 hover:to-blue-400/5 border border-blue-400/20 hover:border-blue-400/40 shadow-md hover:shadow-lg hover:shadow-blue-400/20 transition-all duration-300 hover:scale-105" onClick={() => downloadFileInputRef.current?.click()} disabled={uploading}>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                          <span className="relative z-10">{uploading ? "Uploading..." : "Upload File"}</span>
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">YouTube Demo</label>
                      <EnhancedInput value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="media" className="space-y-6">
                <Card className="bg-background/60 backdrop-blur-sm border-white/10 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-white/10">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">Project Image</p>
                        <p className="text-sm text-muted-foreground font-normal">Visual showcase for your project</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer group ${
                        dragActive ? "border-primary bg-primary/5" : "border-white/20 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {image ? (
                        <div className="relative">
                          <img src={image} alt="Preview" className="max-w-full max-h-48 mx-auto rounded-lg" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="text-white">
                              <Upload className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm font-medium">Click to change image</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 mx-auto mb-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <p className="text-lg font-medium mb-2">Click to select or drag an image</p>
                          <p className="text-sm text-muted-foreground mb-2">Supports JPG, PNG, GIF, WebP</p>
                          <Button type="button" variant="outline" size="sm" className="group relative overflow-hidden mt-2 bg-gradient-to-r from-background/90 to-background/70 hover:from-green-500/10 hover:to-green-400/5 border border-green-400/20 hover:border-green-400/40 shadow-md hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                            <span className="relative z-10">Browse Files</span>
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="relative">
                      <label className="text-sm font-medium mb-2 block">Or paste image URL</label>
                      <div className="flex gap-2">
                        <EnhancedInput 
                          value={image} 
                          onChange={e => setImage(e.target.value)} 
                          placeholder="https://images.com/project.jpg"
                          className="flex-1" 
                        />
                        {image && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setImage("")}
                            className="hover:bg-red-500/20"
                          >
                            <X className="h-4 w-4 text-red-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/60 backdrop-blur-sm border-white/10 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-orange-500/5 to-orange-400/10 border-b border-white/10">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-400/10 rounded-xl border border-orange-400/20">
                        <ImageIcon className="h-5 w-5 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">Project Icon</p>
                        <p className="text-sm text-muted-foreground font-normal">Optional square icon for your project</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <input
                      ref={iconFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleIconFileSelect}
                      className="hidden"
                    />
                    <div
                      className="relative border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer group border-white/20 hover:border-orange-400/40 hover:bg-orange-500/5"
                      onClick={() => iconFileInputRef.current?.click()}
                    >
                      {icon ? (
                        <div className="relative">
                          <img src={icon} alt="Icon Preview" className="w-24 h-24 mx-auto rounded-lg object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <div className="text-white">
                              <Upload className="h-6 w-6 mx-auto mb-1" />
                              <p className="text-xs font-medium">Click to change</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <p className="text-base font-medium mb-1">Click to select an icon</p>
                          <p className="text-xs text-muted-foreground mb-2">Square format recommended</p>
                          <Button type="button" variant="outline" size="sm" className="group relative overflow-hidden mt-2 bg-gradient-to-r from-background/90 to-background/70 hover:from-orange-500/10 hover:to-orange-400/5 border border-orange-400/20 hover:border-orange-400/40 shadow-md hover:shadow-lg hover:shadow-orange-400/20 transition-all duration-300 hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/5 to-orange-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                            <span className="relative z-10">Browse Files</span>
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="relative">
                      <label className="text-sm font-medium mb-2 block">Or paste icon URL</label>
                      <div className="flex gap-2">
                        <EnhancedInput 
                          value={icon} 
                          onChange={e => setIcon(e.target.value)} 
                          placeholder="https://images.com/icon.png"
                          className="flex-1" 
                        />
                        {icon && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setIcon("")}
                            className="hover:bg-red-500/20"
                          >
                            <X className="h-4 w-4 text-red-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-6">
                <MarkdownEditorEnhanced
                  value={content}
                  onChange={setContent}
                  placeholder={`# Project Documentation

## Overview
Describe your project in detail...

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
\`\`\`bash
# Add installation instructions
\`\`\`

## Usage
\`\`\`javascript
// Add code examples
\`\`\`

## Contributing
Instructions for contributors...`}
                  height={500}
                />
              </TabsContent>
              
              <TabsContent value="style" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Project Styling
                    </CardTitle>
                    <CardDescription>Customize how your project looks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Use Custom Styling</label>
                        <p className="text-xs text-muted-foreground">Override default card appearance</p>
                      </div>
                      <Switch 
                        checked={useCustomStyle}
                        onCheckedChange={setUseCustomStyle}
                      />
                    </div>
                    
                    {useCustomStyle && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Background Gradient</label>
                          <div className="space-y-2">
                            <div className="grid grid-cols-4 gap-2">
                              {[
                                "bg-gradient-to-br from-blue-600 to-purple-700",
                                "bg-gradient-to-br from-emerald-500 to-blue-600",
                                "bg-gradient-to-br from-rose-500 to-pink-600",
                                "bg-gradient-to-br from-purple-600 to-pink-600",
                                "bg-gradient-to-br from-orange-500 to-red-600",
                                "bg-gradient-to-br from-cyan-500 to-blue-600",
                                "bg-gradient-to-br from-red-600 to-rose-600",
                                "bg-gradient-to-br from-indigo-600 to-purple-700",
                                "bg-gradient-to-br from-teal-500 to-cyan-600",
                                "bg-gradient-to-br from-amber-500 to-orange-600",
                                "bg-gradient-to-br from-violet-600 to-purple-700",
                                "bg-gradient-to-br from-emerald-600 to-teal-600",
                                "bg-gradient-to-r from-blue-700 via-purple-600 to-violet-700",
                                "bg-gradient-to-r from-emerald-600 via-cyan-500 to-blue-600",
                                "bg-gradient-to-r from-rose-600 via-pink-500 to-purple-600",
                                "bg-gradient-to-r from-orange-600 via-red-500 to-rose-600",
                                "bg-gradient-to-br from-slate-900 to-slate-700",
                                "bg-gradient-to-br from-zinc-900 to-zinc-700",
                                "bg-gradient-to-br from-gray-900 to-gray-700",
                                "bg-gradient-to-br from-neutral-900 to-neutral-700",
                                "bg-gradient-to-r from-slate-800 via-gray-800 to-zinc-800",
                                "bg-gradient-to-r from-black via-gray-900 to-slate-900",
                                "bg-gradient-to-br from-fuchsia-600 to-pink-700",
                                "bg-gradient-to-br from-sky-500 to-indigo-600",
                                "bg-gradient-to-br from-lime-500 to-emerald-600",
                                "bg-gradient-to-br from-yellow-500 to-orange-600",
                                "bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-600",
                                "bg-gradient-to-r from-teal-600 via-emerald-500 to-green-600",
                                "bg-gradient-to-r from-red-700 via-rose-600 to-pink-600",
                                "bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-700",
                                "bg-gradient-to-br from-emerald-700 to-cyan-700",
                                "bg-gradient-to-br from-violet-700 to-fuchsia-700"
                              ].map(gradient => (
                                <button
                                  key={gradient}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setCardGradient(gradient)
                                  }}
                                  className={`h-12 rounded-lg ${gradient} ${cardGradient === gradient ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''} hover:scale-105 transition-transform`}
                                />
                              ))}
                            </div>
                            <EnhancedInput 
                              value={cardGradient}
                              onChange={e => setCardGradient(e.target.value)}
                              placeholder="Custom gradient class (e.g., bg-gradient-to-r from-red-500 to-blue-500)"
                            />
                            <GradientPicker 
                              value={cardGradient}
                              onChange={setCardGradient}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Solid Color</label>
                          <div className="space-y-2">
                            <div className="grid grid-cols-6 gap-2">
                              {[
                                "bg-red-500",
                                "bg-blue-500",
                                "bg-green-500",
                                "bg-purple-500",
                                "bg-pink-500",
                                "bg-yellow-500",
                                "bg-cyan-500",
                                "bg-orange-500",
                                "bg-black",
                                "bg-neutral-900",
                                "bg-zinc-900",
                                "bg-slate-900",
                                "bg-gray-900",
                                "bg-stone-900",
                                "bg-neutral-800",
                                "bg-zinc-800",
                                "bg-slate-800",
                                "bg-gray-800"
                              ].map(color => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setCardColor(color)
                                    setCardGradient("")
                                  }}
                                  className={`h-12 rounded-lg ${color} ${cardColor === color && !cardGradient ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                                />
                              ))}
                            </div>
                            <EnhancedInput 
                              value={cardColor}
                              onChange={e => {
                                setCardColor(e.target.value)
                                setCardGradient("")
                              }}
                              placeholder="Custom color class (e.g., bg-indigo-600)"
                            />
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setCardGradient("")
                              setCardColor("")
                              setUseCustomStyle(false)
                            }}
                            className="group relative overflow-hidden w-full bg-gradient-to-r from-background/90 to-background/70 hover:from-red-500/10 hover:to-red-400/5 border border-red-400/20 hover:border-red-400/40 shadow-md hover:shadow-lg hover:shadow-red-400/20 transition-all duration-300 hover:scale-[1.02]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                            <span className="relative z-10">Reset to Default</span>
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Title Styling
                    </CardTitle>
                    <CardDescription>Customize the project title appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Use Custom Title Style</label>
                        <p className="text-xs text-muted-foreground">Override default title styling</p>
                      </div>
                      <Switch 
                        checked={useTitleCustomStyle}
                        onCheckedChange={setUseTitleCustomStyle}
                      />
                    </div>
                    
                    {useTitleCustomStyle && (
                      <>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Title Color</label>
                          <div className="space-y-2">
                            <div className="grid grid-cols-8 gap-2">
                              {[
                                "#ffffff", "#f8fafc", "#e2e8f0", "#cbd5e1", "#94a3b8",
                                "#64748b", "#475569", "#334155", "#1e293b", "#0f172a",
                                "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
                                "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
                                "#ec4899", "#f43f5e", "#10b981", "#14b8a6", "#0ea5e9",
                                "#6d28d9", "#7c3aed", "#c026d3", "#db2777", "#be185d",
                                "#dc2626", "#ea580c", "#ca8a04", "#16a34a", "#0891b2"
                              ].map(color => (
                                <button
                                  key={color}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setTitleColor(color)
                                    setTitleGradientFrom("")
                                    setTitleGradientTo("")
                                    setTitleGradientVia("")
                                  }}
                                  className={`h-10 rounded-lg border-2 transition-all ${
                                    titleColor === color && !titleGradientFrom 
                                      ? 'border-primary scale-110' 
                                      : 'border-transparent hover:border-white/20 hover:scale-105'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <EnhancedInput 
                              value={titleColor}
                              onChange={e => {
                                setTitleColor(e.target.value)
                                setTitleGradientFrom("")
                                setTitleGradientTo("")
                                setTitleGradientVia("")
                              }}
                              placeholder="Custom hex color (e.g., #3b82f6)"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Title Gradient</label>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">From Color</label>
                              <EnhancedInput 
                                value={titleGradientFrom}
                                onChange={e => {
                                  setTitleGradientFrom(e.target.value)
                                  setTitleColor("")
                                }}
                                placeholder="#3b82f6"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">To Color</label>
                              <EnhancedInput 
                                value={titleGradientTo}
                                onChange={e => {
                                  setTitleGradientTo(e.target.value)
                                  setTitleColor("")
                                }}
                                placeholder="#8b5cf6"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted-foreground mb-1 block">Via Color (Optional)</label>
                              <EnhancedInput 
                                value={titleGradientVia}
                                onChange={e => setTitleGradientVia(e.target.value)}
                                placeholder="#6366f1"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2 pt-2">
                              {[
                                { name: "Blue to Purple", from: "#3b82f6", to: "#8b5cf6", via: "#6366f1" },
                                { name: "Pink to Orange", from: "#ec4899", to: "#f97316", via: "#ef4444" },
                                { name: "Green to Blue", from: "#10b981", to: "#0ea5e9", via: "#06b6d4" },
                                { name: "Purple to Pink", from: "#8b5cf6", to: "#ec4899", via: "#c084fc" },
                                { name: "Orange to Red", from: "#f97316", to: "#ef4444", via: "#fb7185" },
                                { name: "Teal to Purple", from: "#14b8a6", to: "#a855f7", via: "#3b82f6" }
                              ].map(gradient => (
                                <button
                                  key={gradient.name}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setTitleGradientFrom(gradient.from)
                                    setTitleGradientTo(gradient.to)
                                    setTitleGradientVia(gradient.via)
                                    setTitleColor("")
                                  }}
                                  className={`h-12 rounded-lg text-xs font-medium text-white transition-all ${
                                    titleGradientFrom === gradient.from && titleGradientTo === gradient.to
                                      ? 'ring-2 ring-primary scale-105'
                                      : 'hover:scale-105'
                                  }`}
                                  style={{
                                    background: `linear-gradient(to right, ${gradient.from}, ${gradient.via}, ${gradient.to})`
                                  }}
                                >
                                  {gradient.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setTitleColor("")
                              setTitleGradientFrom("")
                              setTitleGradientTo("")
                              setTitleGradientVia("")
                              setUseTitleCustomStyle(false)
                            }}
                            className="group relative overflow-hidden w-full bg-gradient-to-r from-background/90 to-background/70 hover:from-red-500/10 hover:to-red-400/5 border border-red-400/20 hover:border-red-400/40 shadow-md hover:shadow-lg hover:shadow-red-400/20 transition-all duration-300 hover:scale-[1.02]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                            <span className="relative z-10">Reset Title Style</span>
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="templates" className="space-y-6">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Save as Custom Template</CardTitle>
                    <CardDescription>Save your current project configuration as a reusable template</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <EnhancedInput 
                        value={templateName}
                        onChange={e => setTemplateName(e.target.value)}
                        placeholder="Enter template name..."
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={() => {
                          if (templateName.trim() && title && description && category) {
                            const newTemplate: CustomTemplate = { 
                              title, 
                              description, 
                              category, 
                              tags,
                              ...(useCustomStyle && cardGradient && { cardGradient }),
                              ...(useCustomStyle && cardColor && { cardColor })
                            }
                            const updated = { ...customTemplates, [templateName]: newTemplate }
                            setCustomTemplates(updated)
                            localStorage.setItem('customTemplates', JSON.stringify(updated))
                            setTemplateName("")
                            setResult("Template saved successfully!")
                          }
                        }}
                        disabled={!templateName.trim() || !title || !description || !category}
                        className="group relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/95 hover:via-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10">Save Template</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                {Object.keys(customTemplates).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Your Custom Templates</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      {Object.entries(customTemplates).map(([key, template]) => (
                        <Card key={key} className="group relative cursor-pointer hover:shadow-md transition-shadow" onClick={() => applyTemplate(template)}>
                          <button
                            type="button"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                            onClick={(e) => {
                              e.stopPropagation()
                              const updated = { ...customTemplates }
                              delete updated[key]
                              setCustomTemplates(updated)
                              localStorage.setItem('customTemplates', JSON.stringify(updated))
                            }}
                          >
                            <X className="h-4 w-4 text-red-400" />
                          </button>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{key}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3">{template.description.substring(0, 80)}...</p>
                            <Badge variant="outline" className="text-xs">{template.category}</Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Default Templates</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {Object.entries(DEFAULT_TEMPLATES).map(([key, template]) => (
                    <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => applyTemplate(template)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          {(key === "roblox" || key.startsWith("roblox")) && <Gamepad2 className="h-5 w-5 text-primary" />}
                          {key === "web" && <Globe className="h-5 w-5 text-primary" />}
                          {key === "mobile" && <Code className="h-5 w-5 text-primary" />}
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{template.description.substring(0, 80)}...</p>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center gap-3">
                  {autoSaveStatus && (
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      {autoSaveStatus}
                    </span>
                  )}
                  {result && (
                    <span className={`text-sm font-medium ${
                      result.includes("success") ? "text-green-400" : "text-red-400"
                    }`}>{result}</span>
                  )}
                  {editingProject && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary">
                        Editing: {editingProject.title}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  {editingProject ? (
                    <Button type="button" variant="destructive" className="group relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 shadow-lg hover:shadow-xl hover:shadow-red-500/30 border border-red-500/20 hover:border-red-400/40 transition-all duration-300 hover:scale-105" onClick={() => {
                      setTitle("")
                      setDescription("")
                      setCategory("")
                      setDownloadUrl("")
                      setGithubUrl("")
                      setDemoUrl("")
                      setYoutubeUrl("")
                      setImage("")
                      setIcon("")
                      setTags([])
                      setContent("")
                      setCardGradient("")
                      setCardColor("")
                      setUseCustomStyle(false)
                      setTitleColor("")
                      setTitleGradientFrom("")
                      setTitleGradientTo("")
                      setTitleGradientVia("")
                      setUseTitleCustomStyle(false)
                      setEditingProject(null)
                      setEditingProjectId(null)
                      const url = new URL(window.location.href)
                      url.searchParams.delete('id')
                      router.replace(url.pathname + url.search, { scroll: false })
                    }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative z-10">Cancel Edit</span>
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" className="group relative overflow-hidden bg-gradient-to-r from-background/90 to-background/70 hover:from-muted/20 hover:to-muted/10 border border-muted-foreground/20 hover:border-muted-foreground/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105" onClick={() => {
                      localStorage.removeItem('projectDraft') // Clear draft
                      setTitle("")
                      setDescription("")
                      setCategory("")
                      setDownloadUrl("")
                      setGithubUrl("")
                      setDemoUrl("")
                      setYoutubeUrl("")
                      setImage("")
                      setIcon("")
                      setTags([])
                      setContent("")
                      setCardGradient("")
                      setCardColor("")
                      setUseCustomStyle(false)
                      setTitleColor("")
                      setTitleGradientFrom("")
                      setTitleGradientTo("")
                      setTitleGradientVia("")
                      setUseTitleCustomStyle(false)
                      setPreviewReduce(true)
                      setPreviewSize('md')
                      setSlug("")
                      setIsPrivate(false)
                      setIsNsfw(false)
                      setLicense("")
                      setVersion("")
                      setReleaseNotes("")
                    }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-muted-foreground/0 via-muted-foreground/5 to-muted-foreground/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                      <span className="relative z-10">Clear All</span>
                    </Button>
                  )}
                  <Button type="submit" disabled={saving || getMissingRequired().length > 0} className="group relative overflow-hidden min-w-[120px] bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/95 hover:via-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/30 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative z-10">{saving ? "Saving..." : editingProject ? "Update Project" : "Save Project"}</span>
                  </Button>
                </div>
              </div>
              </form>
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-background/60 backdrop-blur-sm border-white/10 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-white/10">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20">
                    <Eye className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">Live Preview</p>
                    <p className="text-sm text-muted-foreground font-normal">See your project card in real-time</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-1 p-1 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg">
                    <Button
                      type="button"
                      variant={previewSize === 'sm' ? 'gradient' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewSize('sm')}
                      className="h-8 px-3 text-xs rounded-lg"
                    >
                      SM
                    </Button>
                    <Button
                      type="button"
                      variant={previewSize === 'md' ? 'gradient' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewSize('md')}
                      className="h-8 px-3 text-xs rounded-lg"
                    >
                      MD
                    </Button>
                    <Button
                      type="button"
                      variant={previewSize === 'lg' ? 'gradient' : 'ghost'}
                      size="sm"
                      onClick={() => setPreviewSize('lg')}
                      className="h-8 px-3 text-xs rounded-lg"
                    >
                      LG
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Compact</span>
                    <Switch checked={previewReduce} onCheckedChange={setPreviewReduce} />
                  </div>
                </div>
                <div className={`mx-auto ${previewSize==='sm' ? 'max-w-sm' : previewSize==='lg' ? 'max-w-xl' : 'max-w-md'}`}>
                <ProjectCard
                  title={title || "Your Project Title"}
                  description={description || "Your project description will appear here. Make it compelling to attract viewers!"}
                  category={category || "Category"}
                  downloadUrl={downloadUrl || undefined}
                  githubUrl={githubUrl || undefined}
                  demoUrl={demoUrl || undefined}
                  youtubeUrl={youtubeUrl || undefined}
                  image={image || undefined}
                  icon={icon || undefined}
                  tags={tags.length ? tags : ["Sample", "Tags"]}
                  reduce={previewReduce}
                  projectId="12345"
                  cardGradient={useCustomStyle ? cardGradient : undefined}
                  cardColor={useCustomStyle ? cardColor : undefined}
                  titleColor={useTitleCustomStyle ? titleColor : undefined}
                  titleGradient={useTitleCustomStyle && titleGradientFrom && titleGradientTo ? {
                    from: titleGradientFrom,
                    to: titleGradientTo,
                    via: titleGradientVia || undefined
                  } : undefined}
                />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </TabsContent>
        
        <TabsContent value="editor" className="space-y-6">
          <ProjectEditor onEditProject={startEditingProject} />
        </TabsContent>
        
      </Tabs>
      </div>
    </div>
  )
}
