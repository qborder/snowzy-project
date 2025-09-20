"use client"

import { useState, useEffect, useRef } from "react"
import { Project, ProjectVersion } from "@/types/project"
import { useRouter, useSearchParams } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { Badge } from "@/components/ui/badge"
import { GradientPicker } from "@/components/ui/gradient-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Sparkles, Plus, Code, Gamepad2, Globe, X, ImageIcon, Palette, Edit, Edit2, ExternalLink, Eye, EyeOff, Tag, Download, Youtube, Github, Trash2, ArrowRight, LayoutGrid, Type, Loader2, Bug, RotateCcw, Database, Package, ShoppingCart } from "lucide-react"
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
  "UI/UX", "Design", "Figma", "Responsive", "Accessibility", "SEO",
  "Web Development", "Full Stack", "Frontend", "Backend", "Database", "API",
  "Cloud", "DevOps", "Cybersecurity", "Artificial Intelligence", "Machine Learning"
]


type CustomTemplate = {
  title: string
  description: string
  category: string
  tags: string[]
  cardGradient?: string
  cardColor?: string
}

const TemplateCard = ({ template, onApply, onDelete, isCustom }: {
  template: CustomTemplate,
  onApply: () => void,
  onDelete?: () => void,
  isCustom: boolean
}) => {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-white/20 border-white/5 bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold text-foreground/90 line-clamp-1">
            {template.title}
          </CardTitle>
          {isCustom && onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 -mt-1.5 -mr-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-sm h-10">
          {template.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 pt-0">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {template.tags.slice(0, 4).map((tag, i) => (
            <Badge
              key={i}
              variant="outline"
              className="text-[10px] px-1.5 py-0.5 h-5 bg-background/60 backdrop-blur-sm border-white/5 text-muted-foreground font-normal"
            >
              {tag}
            </Badge>
          ))}
          {template.tags.length > 4 && (
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0.5 h-5 bg-background/60 backdrop-blur-sm border-white/5 text-muted-foreground font-normal"
            >
              +{template.tags.length - 4}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 bg-background/60 backdrop-blur-sm hover:bg-primary/5 hover:text-foreground transition-colors border-white/10 group/btn min-w-[100px]"
            onClick={onApply}
          >
            <div className="flex items-center justify-center w-full gap-1.5">
              <span>Apply</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Button>
          {isCustom && onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
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
  const [robloxMarketplaceUrl, setRobloxMarketplaceUrl] = useState("")
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
  const [pinned, setPinned] = useState(false)
  const [hidden, setHidden] = useState(false)

  // Version management state
  const [versionTag, setVersionTag] = useState("")
  const [versionTitle, setVersionTitle] = useState("")
  const [versionDescription, setVersionDescription] = useState("")
  const [versionType, setVersionType] = useState<"stable" | "beta" | "alpha" | "preview" | "hotfix">("stable")
  const [versionAssets, setVersionAssets] = useState<{id: string, name: string, downloadUrl: string, fileSize?: number}[]>([])
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null)
  const [isVersionFormLoading, setIsVersionFormLoading] = useState(false)
  const [versionAssetInput, setVersionAssetInput] = useState("")
  const [isPrerelease, setIsPrerelease] = useState(false)
  const [projectVersions, setProjectVersions] = useState<ProjectVersion[]>([])
  const [creatingVersion, setCreatingVersion] = useState(false)

  // Load project versions when editing a project
  useEffect(() => {
    if (editingProjectId) {
      fetchProjectVersions(editingProjectId)
    }
  }, [editingProjectId])

  async function fetchProjectVersions(projectId: string) {
    try {
      const response = await fetch(`/api/projects/${projectId}/versions`)
      if (response.ok) {
        const versions = await response.json()
        setProjectVersions(versions)
      }
    } catch (error) {
      console.error('Failed to fetch versions:', error)
    }
  }

  async function handleVersionAssetUpload() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '*/*'
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        setUploading(true)
        const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file
        })
        const data = await res.json()
        if (data.url && data.id) {
          const newAsset = {
            id: data.id, // This is the file storage ID, used for downloads
            name: data.filename || file.name,
            downloadUrl: data.url, // API URL for downloading
            fileSize: data.size || 0
          }
          setVersionAssets(prev => [...prev, newAsset])
          setResult(`Asset "${file.name}" uploaded successfully!`)
        }
      } catch (error) {
        setResult(`Failed to upload asset: ${error}`)
      } finally {
        setUploading(false)
      }
    }
    fileInput.click()
  }

  function addVersionAssetUrl() {
    if (versionAssetInput.trim()) {
      const newAsset = {
        id: crypto.randomUUID(),
        name: versionAssetInput.split('/').pop() || 'Asset',
        downloadUrl: versionAssetInput,
        fileSize: 0
      }
      setVersionAssets(prev => [...prev, newAsset])
      setVersionAssetInput("")
    }
  }

  function removeVersionAsset(assetId: string) {
    setVersionAssets(prev => prev.filter(asset => asset.id !== assetId))
  }

  async function handleCreateVersion() {
    if (!versionTag || !versionTitle || !editingProjectId) {
      setResult("Please fill in version tag and title")
      return
    }

    try {
      setCreatingVersion(true)
      const url = editingVersionId ?
        `/api/projects/${editingProjectId}/versions/${editingVersionId}` :
        `/api/projects/${editingProjectId}/versions`

      const response = await fetch(url, {
        method: editingVersionId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tag: versionTag,
          title: versionTitle,
          description: versionDescription,
          type: versionType,
          assets: versionAssets.map(asset => ({
            id: asset.id,
            name: asset.name,
            downloadUrl: asset.downloadUrl,
            fileSize: asset.fileSize
          })),
          isPrerelease
        })
      })

      if (response.ok) {
        const { version } = await response.json()

        if (editingVersionId) {
          // Update existing version
          setProjectVersions(prev => prev.map(v => v.id === editingVersionId ? version : v))
          setResult(`Version ${version.tag} updated successfully!`)
          setEditingVersionId(null)
        } else {
          // Add new version
          setProjectVersions(prev => [version, ...prev])
          setResult(`Version ${version.tag} created successfully!`)
        }

        // Clear form
        setVersionTag("")
        setVersionTitle("")
        setVersionDescription("")
        setVersionType("stable")
        setVersionAssets([])
        setIsPrerelease(false)

      } else {
        const error = await response.text()
        setResult(`Failed to ${editingVersionId ? 'update' : 'create'} version: ${error}`)
      }
    } catch (error) {
      setResult(`Error ${editingVersionId ? 'updating' : 'creating'} version: ${error}`)
    } finally {
      setCreatingVersion(false)
    }
  }

  function handleEditVersion(version: ProjectVersion) {
    setEditingVersionId(version.id)
    setVersionTag(version.tag)
    setVersionTitle(version.title)
    setVersionDescription(version.description || "")
    setVersionType(version.type)
    setVersionAssets(version.assets || [])
    setIsPrerelease(version.isPrerelease || false)
  }

  function cancelVersionEdit() {
    setEditingVersionId(null)
    setVersionTag("")
    setVersionTitle("")
    setVersionDescription("")
    setVersionType("stable")
    setVersionAssets([])
    setIsPrerelease(false)
  }

  async function handleDeleteVersion(versionId: string) {
    if (!confirm("Are you sure you want to delete this version? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${editingProjectId}/versions/${versionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setProjectVersions(prev => prev.filter(v => v.id !== versionId))
        setResult("Version deleted successfully!")

        // If we were editing this version, cancel the edit
        if (editingVersionId === versionId) {
          cancelVersionEdit()
        }
      } else {
        const error = await response.text()
        setResult(`Failed to delete version: ${error}`)
      }
    } catch (error) {
      setResult(`Error deleting version: ${error}`)
    }
  }

  async function handleToggleVersionVisibility(versionId: string, isHidden: boolean) {
    try {
      const response = await fetch(`/api/projects/${editingProjectId}/versions/${versionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHidden })
      })

      if (response.ok) {
        const { version } = await response.json()
        setProjectVersions(prev => prev.map(v => v.id === versionId ? version : v))
        setResult(`Version ${isHidden ? 'hidden' : 'shown'} successfully!`)
      } else {
        const error = await response.text()
        setResult(`Failed to ${isHidden ? 'hide' : 'show'} version: ${error}`)
      }
    } catch (error) {
      setResult(`Error ${isHidden ? 'hiding' : 'showing'} version: ${error}`)
    }
  }

  // Auto-save functionality - saves EVERYTHING
  useEffect(() => {
    if (!title && !description && !category && !content && tags.length === 0 && !image && !icon && !downloadUrl && !githubUrl && !demoUrl && !youtubeUrl && !robloxMarketplaceUrl && !editingProject) {
      return // Don't save completely empty state
    }

    const draft = {
      // Form fields
      title, description, category, downloadUrl, githubUrl, demoUrl, youtubeUrl, robloxMarketplaceUrl, image, icon, tags, content, pinned, hidden,
      // Styling
      cardGradient, cardColor, useCustomStyle, titleColor, titleGradientFrom, titleGradientTo, titleGradientVia, useTitleCustomStyle,
      // UI State
      activeTab, editingProjectId, editingProject, templateName, tagInput,
      // Preview
      previewReduce, previewSize,
      // Version fields
      versionTag, versionTitle, versionDescription, versionType, versionAssets, versionAssetInput, isPrerelease,
      // Timestamp
      timestamp: Date.now()
    }

    localStorage.setItem('projectDraft', JSON.stringify(draft))
    setAutoSaveStatus("Draft saved")

    const timer = setTimeout(() => setAutoSaveStatus(""), 2000)
    return () => clearTimeout(timer)
  }, [title, description, category, downloadUrl, githubUrl, demoUrl, youtubeUrl, robloxMarketplaceUrl, image, icon, tags, content, pinned, hidden, cardGradient, cardColor, useCustomStyle, titleColor, titleGradientFrom, titleGradientTo, titleGradientVia, useTitleCustomStyle, activeTab, editingProjectId, editingProject, templateName, tagInput, previewReduce, previewSize, versionTag, versionTitle, versionDescription, versionType, versionAssets, versionAssetInput, isPrerelease])

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
    setRobloxMarketplaceUrl(project.robloxMarketplaceUrl || "")
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
    setPinned(project.pinned || false)
    setHidden(project.hidden || false)
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
        setRobloxMarketplaceUrl(parsed.robloxMarketplaceUrl || "")
        setImage(parsed.image || "")
        setIcon(parsed.icon || "")
        setTags(parsed.tags || [])
        setContent(parsed.content || "")
        setPinned(parsed.pinned || false)
        setHidden(parsed.hidden || false)

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

  async function handleIconDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    if (!file) return
    try {
      setUploading(true)
      setResult("")
      const res = await fetch(`/api/upload?filename=icon_${Date.now()}_${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      })
      const data = await res.json()
      if (data.url) {
        setIcon(data.url)
        setResult("Icon uploaded successfully!")
      } else {
        setResult("Failed to upload icon: " + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error uploading icon:', error)
      setResult("Error uploading icon: " + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
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
      setImage(data.url)
      setResult("File uploaded successfully")
    } catch (err: unknown) {
      const error = err as Error
      setResult(error.message || "Upload error")
    } finally {
      setUploading(false)
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
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
      setImage(data.url)
      setResult("File uploaded successfully")
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
    const body: Partial<Project> = { title, description, category, downloadUrl, githubUrl, demoUrl, youtubeUrl, robloxMarketplaceUrl, image, icon, tags, content, pinned, hidden }
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
        setRobloxMarketplaceUrl("")
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
        setPinned(false)
        setHidden(false)
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
                      setPinned(false)
                      setHidden(false)
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
            <TabsList className="grid w-full grid-cols-8 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-md border border-white/10 p-1.5 rounded-xl shadow-lg">
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
              <TabsTrigger value="versions" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-br data-[state=active]:from-cyan-500/15 data-[state=active]:to-cyan-400/8 data-[state=active]:text-cyan-400 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/5 to-cyan-400/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-500" />
                <Database className="h-4 w-4 mr-1 transition-all duration-200 group-hover:scale-110 group-data-[state=active]:text-cyan-400" />
                <span className="relative z-10">Versions</span>
              </TabsTrigger>
              <TabsTrigger value="debug" className="group relative overflow-hidden data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-500/15 data-[state=active]:to-red-400/8 data-[state=active]:text-red-400 rounded-lg transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-red-400/0 via-red-400/5 to-red-400/0 -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-500" />
                <Bug className="h-4 w-4 mr-1 transition-all duration-200 group-hover:scale-110 group-data-[state=active]:text-red-400" />
                <span className="relative z-10">Debug</span>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={onSubmit}>
              <TabsContent value="basic" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-white/10 shadow-xl overflow-hidden group">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-white/5 p-5">
                    <CardTitle className="flex items-center gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/20 shadow-sm group-hover:shadow-primary/20 transition-all duration-300">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Project Details</div>
                        <p className="text-sm text-muted-foreground font-medium">Essential information about your project</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 p-6">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        <span>Project Title</span>
                        <span className="text-destructive">*</span>
                      </label>
                      <EnhancedInput
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="My Awesome Project"
                        className="text-lg border-white/10 bg-background/50 hover:bg-background/70 transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        <span>Description</span>
                        <span className="text-destructive">*</span>
                      </label>
                      <div className="relative group/textarea">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-lg opacity-0 group-hover/textarea:opacity-100 transition-opacity -z-10" />
                        <textarea
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          placeholder="Describe what makes your project special..."
                          className="w-full rounded-lg border border-white/10 bg-background/50 hover:bg-background/70 p-4 min-h-[120px] resize-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition-all duration-200 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                          <span>Category</span>
                          <span className="text-destructive">*</span>
                        </label>
                        <span className="text-xs text-muted-foreground">{category ? `${category.length}/40` : '0/40'}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {["Roblox", "Roblox Studio", "Web Development", "Mobile Development", "Game Development"].map(cat => (
                          <Badge
                            key={cat}
                            variant={category === cat ? "default" : "secondary"}
                            className={`cursor-pointer transition-all duration-200 border ${
                              category === cat
                                ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15'
                                : 'bg-background/60 hover:bg-accent/50 border-white/10 hover:border-white/20'
                            }`}
                            onClick={() => setCategory(cat)}
                          >
                            {(cat === "Roblox" || cat === "Roblox Studio") && <Gamepad2 className="h-3 w-3 mr-1.5" />}
                            {cat.includes("Web") && <Globe className="h-3 w-3 mr-1.5" />}
                            {cat.includes("Mobile") && <Code className="h-3 w-3 mr-1.5" />}
                            {cat}
                          </Badge>
                        ))}
                      </div>
                      <EnhancedInput
                        value={category}
                        onChange={e => setCategory(e.target.value.slice(0, 40))}
                        placeholder="Or enter custom category"
                        className="bg-background/50 hover:bg-background/70 border-white/10 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground">Project Settings</label>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-background/30 hover:bg-background/50 transition-colors">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Pinned</div>
                            <div className="text-xs text-muted-foreground">Pin this project to the top of the list</div>
                          </div>
                          <Switch
                            checked={pinned}
                            onCheckedChange={setPinned}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-background/30 hover:bg-background/50 transition-colors">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Hidden</div>
                            <div className="text-xs text-muted-foreground">Hide this project from public view</div>
                          </div>
                          <Switch
                            checked={hidden}
                            onCheckedChange={setHidden}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/80 backdrop-blur-sm border-white/10 shadow-xl overflow-hidden group">
                  <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-400/5 border-b border-blue-400/10 p-5">
                    <CardTitle className="flex items-center gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-blue-400/10 rounded-xl border border-blue-400/20 shadow-sm group-hover:shadow-blue-400/20 transition-all duration-300">
                        <Tag className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Technologies & Tags</div>
                        <p className="text-sm text-muted-foreground font-medium">Help others discover your project</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground">
                          Technologies & Tags
                          <span className="text-destructive ml-1">*</span>
                        </label>
                        <span className="text-xs text-muted-foreground">{tags.length} tags</span>
                      </div>

                      <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-400/3 rounded-lg opacity-0 group-hover/input:opacity-100 transition-opacity -z-10" />
                        <div className="flex flex-wrap gap-2 p-2.5 min-h-[44px] rounded-lg border border-white/10 bg-background/50 hover:bg-background/70 transition-colors">
                          {tags.map(tag => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="group/tag flex items-center gap-1 bg-background/80 hover:bg-background border border-white/10 hover:border-white/20 transition-colors"
                            >
                              <span className="text-foreground/90">{tag}</span>
                              <X
                                className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTag(tag);
                                }}
                              />
                            </Badge>
                          ))}
                          <input
                            type="text"
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyPress}
                            placeholder={tags.length ? "" : "Add tags (press Enter or comma)"}
                            className="flex-1 min-w-[150px] bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {tags.length === 0 ? (
                            <span className="text-amber-400">Add at least one tag</span>
                          ) : tags.length < 3 ? (
                            <span className="text-amber-400">Add {3 - tags.length} more for better visibility</span>
                          ) : (
                            <span>Tags help others discover your project</span>
                          )}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                          onClick={() => addTag(tagInput.trim())}
                          disabled={!tagInput.trim()}
                        >
                          Add Tag
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Popular tags:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_TAGS
                          .filter(tag => !tags.includes(tag))
                          .slice(0, 8)
                          .map(tag => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="cursor-pointer text-xs px-2 py-0.5 h-6 bg-background/60 hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-400/30 transition-colors"
                              onClick={() => addTag(tag)}
                            >
                              + {tag}
                            </Badge>
                          ))
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>


              <TabsContent value="links" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-white/10 shadow-xl overflow-hidden group">
                  <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-400/5 border-b border-green-400/10 p-5">
                    <CardTitle className="flex items-center gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-green-500/20 to-green-400/10 rounded-xl border border-green-400/20 shadow-sm group-hover:shadow-green-400/20 transition-all duration-300">
                        <ExternalLink className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">Project Links</div>
                        <p className="text-sm text-muted-foreground font-medium">Connect your project resources</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                          <Globe className="h-3.5 w-3.5 text-green-400/80" />
                          <span>GitHub Repository</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-muted-foreground/60" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.027 2.747-1.027.546 1.377.202 2.394.1 2.646.64.7 1.028 1.593 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.19 22 16.428 22 12.017 22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <EnhancedInput
                            value={githubUrl}
                            onChange={e => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/username/repo"
                            className="pl-9 bg-background/50 hover:bg-background/70 border-white/10 focus:ring-2 focus:ring-green-400/30 focus:border-green-400/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                          <ExternalLink className="h-3.5 w-3.5 text-green-400/80" />
                          <span>Live Demo</span>
                        </label>
                        <EnhancedInput
                          value={demoUrl}
                          onChange={e => setDemoUrl(e.target.value)}
                          placeholder="https://your-project.com"
                          className="bg-background/50 hover:bg-background/70 border-white/10 focus:ring-2 focus:ring-green-400/30 focus:border-green-400/50 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                          <Download className="h-3.5 w-3.5 text-green-400/80" />
                          <span>Download Link</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <EnhancedInput
                              value={downloadUrl}
                              onChange={e => setDownloadUrl(e.target.value)}
                              placeholder="https://releases.com/download"
                              className="w-full h-10 bg-background/50 hover:bg-background/70 border-white/10 focus:ring-2 focus:ring-green-400/30 focus:border-green-400/50 transition-colors"
                            />
                          </div>
                          <input ref={downloadFileInputRef} type="file" accept="*/*" onChange={handleDownloadFileSelect} className="hidden" />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-10 px-3.5 whitespace-nowrap bg-background/60 hover:bg-green-500/10 border-green-400/20 text-green-400 hover:text-green-300 hover:border-green-400/40 transition-colors flex-shrink-0"
                            onClick={() => downloadFileInputRef.current?.click()}
                            disabled={uploading}
                          >
                            {uploading ? (
                              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4 mr-1.5" />
                            )}
                            {uploading ? "Uploading..." : "Upload"}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                          <svg className="h-3.5 w-3.5 text-green-400/80" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                          </svg>
                          <span>YouTube Demo</span>
                        </label>
                        <EnhancedInput
                          value={youtubeUrl}
                          onChange={e => setYoutubeUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="bg-background/50 hover:bg-background/70 border-white/10 focus:ring-2 focus:ring-green-400/30 focus:border-green-400/50 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                          <ShoppingCart className="h-3.5 w-3.5 text-blue-400/80" />
                          <span>Roblox Marketplace</span>
                        </label>
                        <EnhancedInput
                          value={robloxMarketplaceUrl}
                          onChange={e => setRobloxMarketplaceUrl(e.target.value)}
                          placeholder="https://www.roblox.com/catalog/..."
                          className="bg-background/50 hover:bg-background/70 border-white/10 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400/50 transition-colors"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-white/10 shadow-xl overflow-hidden group">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-400/5 border-b border-purple-400/10 p-5">
                    <CardTitle className="flex items-center gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-purple-400/10 rounded-xl border border-purple-400/20 shadow-sm group-hover:shadow-purple-400/20 transition-all duration-300">
                        <ImageIcon className="h-5 w-5 text-purple-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Project Image</div>
                        <p className="text-sm text-muted-foreground font-medium">Visual showcase for your project</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="*/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group/upload ${
                        dragActive
                          ? "border-primary/60 bg-primary/5"
                          : "border-white/10 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300 -z-10" />

                      {image ? (
                        <div className="relative group/image-preview">
                          <div className="relative overflow-hidden rounded-lg bg-background/20">
                            <img
                              src={image}
                              alt="Preview"
                              className="w-full max-h-64 object-contain mx-auto rounded-lg transition-all duration-300 group-hover/image-preview:scale-[1.02]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover/image-preview:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                              <div className="text-center space-y-3 transform translate-y-4 group-hover/image-preview:translate-y-0 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors">
                                  <Upload className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">Click to change image</p>
                                  <p className="text-xs text-white/70 mt-1">or drag and drop a new one</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 px-4 transition-all duration-300 group-hover/upload:scale-[1.01]">
                          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover/upload:bg-purple-500/20 group-hover/upload:text-purple-300 transition-colors">
                            <Upload className="h-6 w-6" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-base font-medium text-foreground">
                              {dragActive ? 'Drop image here' : 'Upload project image'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Drag & drop or <span className="text-primary font-medium">browse files</span>
                            </p>
                            <p className="text-xs text-muted-foreground pt-2">
                              Recommended: 1200×630px • JPG, PNG, WebP (max 5MB)
                            </p>
                          </div>
                        </div>
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
                        <p className="text-sm text-muted-foreground font-normal">Square icon that represents your project</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <input
                      ref={iconFileInputRef}
                      type="file"
                      accept="*/*"
                      onChange={handleIconFileSelect}
                      className="hidden"
                    />
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group/upload ${
                        dragActive
                          ? "border-orange-400/60 bg-orange-500/5"
                          : "border-white/10 hover:border-orange-400/40 hover:bg-orange-500/5"
                      }`}
                      onDrop={handleIconDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => iconFileInputRef.current?.click()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-xl opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300 -z-10" />

                      {icon ? (
                        <div className="relative group/icon-preview">
                          <div className="relative w-32 h-32 mx-auto overflow-hidden rounded-xl bg-background/20">
                            <img
                              src={icon}
                              alt="Icon Preview"
                              className="w-full h-full object-cover transition-all duration-300 group-hover/icon-preview:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/icon-preview:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="text-center space-y-2 transform translate-y-3 group-hover/icon-preview:translate-y-0 transition-all duration-300">
                                <div className="inline-flex items-center justify-center w-10 h-10 mx-auto rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover/icon-preview:bg-white/20 transition-colors">
                                  <Upload className="h-4 w-4 text-white" />
                                </div>
                                <p className="text-xs font-medium text-white">Click to change icon</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 px-4 transition-all duration-300 group-hover/upload:scale-[1.01]">
                          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover/upload:bg-orange-500/20 group-hover/upload:text-orange-300 transition-colors">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-base font-medium text-foreground">
                              {dragActive ? 'Drop icon here' : 'Upload project icon'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Drag & drop or <span className="text-orange-400 font-medium">browse files</span>
                            </p>
                            <p className="text-xs text-muted-foreground pt-2">
                              Recommended: 512×512px • PNG with transparency
                            </p>
                          </div>
                        </div>
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
                <Card className="border-white/10 bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-indigo-400/10 rounded-xl border border-indigo-400/20">
                        <Palette className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">Project Styling</p>
                        <p className="text-sm text-muted-foreground font-normal">Customize the card appearance</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-white/10">
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <span>Custom Styling</span>
                          <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                            BETA
                          </span>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">Enable to customize the card appearance</p>
                      </div>
                      <Switch
                        checked={useCustomStyle}
                        onCheckedChange={setUseCustomStyle}
                        className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-white/10"
                      />
                    </div>

                    {useCustomStyle && (
                      <>
                        <div className="space-y-4 p-4 bg-background/30 rounded-lg border border-white/10">
                          <div>
                            <h4 className="text-sm font-medium flex items-center gap-2">
                              <span>Background</span>
                              <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                GRADIENT
              </span>
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">Choose a gradient or solid color for the card background</p>
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-4 gap-3">
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
                                <div key={gradient} className="relative group">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      setCardGradient(gradient)
                                      setCardColor("")
                                    }}
                                    className={`w-full aspect-square rounded-lg ${gradient} ${cardGradient === gradient ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-background' : 'ring-1 ring-white/10 hover:ring-white/20'} transition-all hover:scale-105`}
                                    title={gradient.replace('bg-', '').replace(/-/g, ' ')}
                                  />
                                  {cardGradient === gradient && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-muted-foreground">Custom Gradient</label>
                                <GradientPicker
                                  value={cardGradient}
                                  onChange={setCardGradient}
                                />
                              </div>
                              <EnhancedInput
                                value={cardGradient}
                                onChange={e => setCardGradient(e.target.value)}
                                placeholder="bg-gradient-to-r from-indigo-500 to-purple-600"
                                className="font-mono text-xs"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 p-4 bg-background/30 rounded-lg border border-white/10">
                          <div>
                            <h4 className="text-sm font-medium">Solid Color</h4>
                            <p className="text-xs text-muted-foreground mt-1">Choose a solid color for the card background</p>
                          </div>
                          <div className="space-y-3">
                            <div className="grid grid-cols-8 gap-2">
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
                                <div key={color} className="relative group">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault()
                                      setCardColor(color)
                                      setCardGradient("")
                                    }}
                                    className={`w-full aspect-square rounded-lg ${color} ${cardColor === color && !cardGradient ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-background' : 'ring-1 ring-white/10 hover:ring-white/20'} transition-all hover:scale-105`}
                                    title={color.replace('bg-', '').replace(/-/g, ' ')}
                                  />
                                  {cardColor === color && !cardGradient && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
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
                            <span className="relative z-10 flex items-center gap-2">
                              <Trash2 className="h-4 w-4" />
                              Reset to Default
                            </span>
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-gradient-to-br from-background/80 to-background/50 backdrop-blur-sm">
                  <CardHeader className="border-b border-white/10">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-amber-500/20 to-amber-400/10 rounded-xl border border-amber-400/20">
                        <Type className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xl font-bold">Title Styling</p>
                        <p className="text-sm text-muted-foreground font-normal">Customize the title appearance</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-white/10">
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2">
                          <span>Custom Title Styling</span>
                          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
                            BETA
                          </span>
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">Enable to customize the title appearance</p>
                      </div>
                      <Switch
                        checked={useTitleCustomStyle}
                        onCheckedChange={setUseTitleCustomStyle}
                        className="data-[state=checked]:bg-amber-600 data-[state=unchecked]:bg-white/10"
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

              <TabsContent value="templates" className="space-y-8">
                <div className="grid gap-6">
                  <Card className="bg-gradient-to-br from-orange-500/5 to-orange-400/3 border-orange-500/10 group">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-400/5 border border-orange-500/10">
                          <Sparkles className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">Save as Template</CardTitle>
                          <CardDescription>Save your current project configuration as a reusable template</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                          <EnhancedInput
                            value={templateName}
                            onChange={e => setTemplateName(e.target.value)}
                            placeholder="Enter a name for your template..."
                            className="w-full bg-background/50 backdrop-blur-sm border-white/10 focus:border-orange-400/50 focus:ring-2 focus:ring-orange-400/20"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-xs text-muted-foreground">{templateName.length}/40</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            if (templateName.trim() && title && description && category) {
                              const newTemplate: CustomTemplate = {
                                title,
                                description,
                                category,
                                tags: [...tags],
                                ...(useCustomStyle && cardGradient && { cardGradient }),
                                ...(useCustomStyle && cardColor && { cardColor })
                              }
                              const updated = { ...customTemplates, [templateName]: newTemplate }
                              setCustomTemplates(updated)
                              localStorage.setItem('customTemplates', JSON.stringify(updated))
                              setTemplateName("")
                              setResult(`Template "${templateName}" saved successfully!`)
                            }
                          }}
                          disabled={!templateName.trim() || templateName.length > 40 || !title || !description || !category}
                          className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-500/90 hover:to-orange-400/90 text-white shadow-lg hover:shadow-xl hover:shadow-orange-500/20 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-white/10 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full" />
                          <span className="relative z-10 flex items-center">
                            <Sparkles className="h-4 w-4 mr-1.5" />
                            Save Template
                          </span>
                        </Button>
                      </div>
                      {templateName.length > 35 && (
                        <p className="mt-1.5 text-xs text-amber-500 flex items-center">
                          <span className="w-4 h-4 mr-1">⚠️</span>
                          Keep template names under 40 characters
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full bg-orange-400"></span>
                      Available Templates
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full border border-white/5">
                        {Object.keys({...DEFAULT_TEMPLATES, ...customTemplates}).length} templates
                      </span>
                      <div className="h-8 w-px bg-white/10 mx-1"></div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5"
                        onClick={() => document.getElementById('default-templates')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
                        Default Templates
                      </Button>
                    </div>
                  </div>

                  {Object.keys(customTemplates).length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(customTemplates).map(([key, template]) => (
                        <TemplateCard
                          key={key}
                          template={template}
                          onApply={() => applyTemplate(template)}
                          onDelete={() => {
                            const { [key]: _, ...rest } = customTemplates
                            setCustomTemplates(rest)
                            localStorage.setItem('customTemplates', JSON.stringify(rest))
                            setResult(`Template "${template.title}" deleted`)
                          }}
                          isCustom={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-white/10 p-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 mb-3">
                        <Sparkles className="h-5 w-5 text-orange-400" />
                      </div>
                      <h4 className="text-sm font-medium text-foreground/90 mb-1">No custom templates yet</h4>
                      <p className="text-xs text-muted-foreground max-w-md mx-auto">
                        Save your project configuration as a template to quickly apply it to future projects.
                      </p>
                    </div>
                  )}
                </div>

                <div id="default-templates" className="space-y-4 pt-4">
                  <h3 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-blue-400"></span>
                    Default Templates
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(DEFAULT_TEMPLATES).map(([key, template]) => (
                      <TemplateCard
                        key={key}
                        template={template}
                        onApply={() => applyTemplate(template)}
                        isCustom={false}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="versions" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-white/10 shadow-xl overflow-hidden group">
                  <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-cyan-400/5 border-b border-cyan-400/10 p-5">
                    <CardTitle className="flex items-center gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-xl border border-cyan-400/20 shadow-sm group-hover:shadow-cyan-400/20 transition-all duration-300">
                        <Database className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">Version Management</div>
                        <p className="text-sm text-muted-foreground font-medium">Manage releases and versions like GitHub</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 p-6">
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                          <span>Version Tag</span>
                          <span className="text-destructive">*</span>
                        </label>
                        <EnhancedInput
                          value={versionTag}
                          onChange={(e) => setVersionTag(e.target.value)}
                          placeholder="v1.0.0"
                          className="text-lg border-white/10 bg-background/50 hover:bg-background/70 transition-colors focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                          <span>Release Title</span>
                          <span className="text-destructive">*</span>
                        </label>
                        <EnhancedInput
                          value={versionTitle}
                          onChange={(e) => setVersionTitle(e.target.value)}
                          placeholder="Major Update - New Features & Bug Fixes"
                          className="text-lg border-white/10 bg-background/50 hover:bg-background/70 transition-colors focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">
                          Release Notes
                        </label>
                        <div className="relative group/textarea">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-cyan-400/0 rounded-lg opacity-0 group-hover/textarea:opacity-100 transition-opacity -z-10" />
                          <textarea
                            value={versionDescription}
                            onChange={(e) => setVersionDescription(e.target.value)}
                            placeholder="What's new in this version?&#10;- Added new feature X&#10;- Fixed bug Y&#10;- Improved performance"
                            className="w-full rounded-lg border border-white/10 bg-background/50 hover:bg-background/70 p-4 min-h-[120px] resize-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200 backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">Version Type</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { type: "stable", color: "green", icon: "✅" },
                            { type: "beta", color: "blue", icon: "🚧" },
                            { type: "alpha", color: "yellow", icon: "⚠️" },
                            { type: "preview", color: "purple", icon: "👀" },
                            { type: "hotfix", color: "red", icon: "🔥" }
                          ].map(({ type, color, icon }) => (
                            <Badge
                              key={type}
                              variant="outline"
                              onClick={() => setVersionType(type as "stable" | "beta" | "alpha" | "preview" | "hotfix")}
                              className={`cursor-pointer transition-all duration-200 border hover:scale-105 ${
                                versionType === type ? 'ring-2 ring-cyan-400/50 ' : ''
                              }${
                                color === 'green' ? 'bg-green-500/10 hover:bg-green-500/15 text-green-400 border-green-400/20 hover:border-green-400/30' :
                                color === 'blue' ? 'bg-blue-500/10 hover:bg-blue-500/15 text-blue-400 border-blue-400/20 hover:border-blue-400/30' :
                                color === 'yellow' ? 'bg-yellow-500/10 hover:bg-yellow-500/15 text-yellow-400 border-yellow-400/20 hover:border-yellow-400/30' :
                                color === 'purple' ? 'bg-purple-500/10 hover:bg-purple-500/15 text-purple-400 border-purple-400/20 hover:border-purple-400/30' :
                                'bg-red-500/10 hover:bg-red-500/15 text-red-400 border-red-400/20 hover:border-red-400/30'
                              }`}
                            >
                              <span className="mr-1">{icon}</span>
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-muted-foreground">Download Assets</label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <EnhancedInput
                              value={versionAssetInput}
                              onChange={(e) => setVersionAssetInput(e.target.value)}
                              placeholder="https://releases.com/asset.zip or upload file"
                              className="flex-1 bg-background/50 hover:bg-background/70 border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50 transition-colors"
                              onKeyPress={(e) => e.key === 'Enter' && addVersionAssetUrl()}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addVersionAssetUrl}
                              disabled={!versionAssetInput.trim()}
                              className="bg-background/60 hover:bg-cyan-500/10 border-cyan-400/20 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors disabled:opacity-50"
                            >
                              Add URL
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleVersionAssetUpload}
                              disabled={uploading}
                              className="bg-background/60 hover:bg-cyan-500/10 border-cyan-400/20 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors"
                            >
                              <Upload className="h-4 w-4 mr-1.5" />
                              {uploading ? "Uploading..." : "Upload"}
                            </Button>
                          </div>

                          {versionAssets.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground">Assets ({versionAssets.length}):</p>
                              <div className="space-y-1.5">
                                {versionAssets.map((asset) => (
                                  <div key={asset.id} className="flex items-center justify-between p-2 rounded-lg bg-background/30 border border-white/10">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Download className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                                      <span className="text-sm truncate">{asset.name}</span>
                                      {asset.fileSize && asset.fileSize > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                          ({(asset.fileSize / 1024 / 1024).toFixed(1)} MB)
                                        </span>
                                      )}
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeVersionAsset(asset.id)}
                                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="prerelease"
                            checked={isPrerelease}
                            onChange={(e) => setIsPrerelease(e.target.checked)}
                            className="rounded border-gray-300 text-cyan-400 focus:ring-cyan-400/30"
                          />
                          <label htmlFor="prerelease" className="text-sm text-muted-foreground">
                            Mark as pre-release
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={handleCreateVersion}
                            disabled={!editingProjectId || creatingVersion}
                            className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-500/90 hover:to-cyan-400/90 text-white shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {creatingVersion ? (editingVersionId ? "Updating..." : "Creating...") : (editingVersionId ? "Update Version" : "Create Version")}
                          </Button>
                          {editingVersionId && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelVersionEdit}
                              disabled={creatingVersion}
                              className="px-4 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/40 transition-colors"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/10">
                      <h3 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                        <span className="w-1 h-5 rounded-full bg-cyan-400"></span>
                        Version History
                      </h3>

                      <div className="space-y-3">
                        {projectVersions.length > 0 ? (
                          projectVersions.map((version) => {
                            const versionTypeInfo = {
                              stable: { color: "green", icon: "✅" },
                              beta: { color: "blue", icon: "🚧" },
                              alpha: { color: "yellow", icon: "⚠️" },
                              preview: { color: "purple", icon: "👀" },
                              hotfix: { color: "red", icon: "🔥" }
                            }[version.type] || { color: "gray", icon: "📦" }

                            return (
                              <div key={version.id} className="p-4 rounded-lg border border-white/10 bg-background/30 hover:bg-background/50 transition-colors">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-3">
                                    <Badge className={`${
                                      versionTypeInfo.color === 'green' ? 'bg-green-500/10 text-green-400 border-green-400/20' :
                                      versionTypeInfo.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-400/20' :
                                      versionTypeInfo.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20' :
                                      versionTypeInfo.color === 'purple' ? 'bg-purple-500/10 text-purple-400 border-purple-400/20' :
                                      versionTypeInfo.color === 'red' ? 'bg-red-500/10 text-red-400 border-red-400/20' :
                                      'bg-gray-500/10 text-gray-400 border-gray-400/20'
                                    }`}>
                                      <span className="mr-1">{versionTypeInfo.icon}</span>
                                      {version.type}
                                    </Badge>
                                    <span className="font-mono text-sm font-medium">{version.tag}</span>
                                    {version.isPrerelease && (
                                      <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-400 border-orange-400/20">
                                        Pre-release
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(version.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <h4 className="font-medium text-sm mb-1">{version.title}</h4>
                                {version.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                    {version.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center gap-2">
                                    {version.assets && version.assets.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        {version.assets.map((asset) => (
                                          <Button
                                            key={asset.id}
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 px-2 text-xs hover:bg-cyan-500/10"
                                            onClick={async () => {
                                              window.open(`/api/projects/${editingProjectId}/versions/${version.id}/download?assetId=${asset.id}`, '_blank')
                                            }}
                                          >
                                            <Download className="h-3 w-3 mr-1" />
                                            {asset.name}
                                          </Button>
                                        ))}
                                      </div>
                                    )}
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                      {version.downloads} downloads
                                    </Button>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                      onClick={() => handleEditVersion(version)}
                                      title="Edit version"
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                      onClick={() => handleToggleVersionVisibility(version.id, !version.isHidden)}
                                      title={version.isHidden ? "Show version" : "Hide version"}
                                    >
                                      {version.isHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                      onClick={() => handleDeleteVersion(version.id)}
                                      title="Delete version"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-center py-8">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted/50 mb-3">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <h4 className="text-sm font-medium text-foreground/90 mb-1">No versions yet</h4>
                            <p className="text-xs text-muted-foreground max-w-md mx-auto">
                              {editingProjectId ? "Create your first version using the form above." : "Save your project first, then edit it to manage versions."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="debug" className="space-y-6">
                <Card className="bg-background/80 backdrop-blur-sm border-white/10 shadow-xl overflow-hidden group">
                  <CardHeader className="bg-gradient-to-r from-red-500/10 to-red-400/5 border-b border-red-400/10 p-5">
                    <CardTitle className="flex items-center gap-4">
                      <div className="p-2.5 bg-gradient-to-br from-red-500/20 to-red-400/10 rounded-xl border border-red-400/20 shadow-sm group-hover:shadow-red-400/20 transition-all duration-300">
                        <Bug className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">Debug Tools</div>
                        <p className="text-sm text-muted-foreground font-medium">Reset project statistics and data</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="group relative overflow-hidden bg-background/60 hover:bg-red-500/10 border-red-400/20 text-red-400 hover:text-red-300 hover:border-red-400/40 transition-all duration-300 hover:scale-105"
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/projects/reset-downloads', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' }
                            })
                            if (response.ok) {
                              setResult("Download counts reset successfully!")
                            } else {
                              setResult("Failed to reset download counts")
                            }
                          } catch (error) {
                            setResult("Error resetting download counts")
                          }
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        <Download className="h-4 w-4 mr-2" />
                        <span className="relative z-10">Reset Downloads</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="group relative overflow-hidden bg-background/60 hover:bg-red-500/10 border-red-400/20 text-red-400 hover:text-red-300 hover:border-red-400/40 transition-all duration-300 hover:scale-105"
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/projects/reset-views', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' }
                            })
                            if (response.ok) {
                              setResult("View counts reset successfully!")
                            } else {
                              setResult("Failed to reset view counts")
                            }
                          } catch (error) {
                            setResult("Error resetting view counts")
                          }
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="relative z-10">Reset Views</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="group relative overflow-hidden bg-background/60 hover:bg-red-500/10 border-red-400/20 text-red-400 hover:text-red-300 hover:border-red-400/40 transition-all duration-300 hover:scale-105"
                        onClick={() => {
                          localStorage.removeItem('projectDraft')
                          localStorage.removeItem('customTemplates')
                          setCustomTemplates({})
                          setResult("Local storage cleared successfully!")
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        <Database className="h-4 w-4 mr-2" />
                        <span className="relative z-10">Clear Storage</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="group relative overflow-hidden bg-background/60 hover:bg-red-500/10 border-red-400/20 text-red-400 hover:text-red-300 hover:border-red-400/40 transition-all duration-300 hover:scale-105"
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/projects/reset-all', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' }
                            })
                            if (response.ok) {
                              setResult("All project data reset successfully!")
                            } else {
                              setResult("Failed to reset project data")
                            }
                          } catch (error) {
                            setResult("Error resetting project data")
                          }
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/0 via-red-400/5 to-red-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        <RotateCcw className="h-4 w-4 mr-2" />
                        <span className="relative z-10">Reset All Data</span>
                      </Button>
                    </div>

                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                          <span className="text-amber-400 text-xs font-bold">!</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-amber-400">Warning</p>
                          <p className="text-xs text-amber-300/80">
                            These actions are irreversible. Use with caution as they will permanently reset project statistics and data.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center gap-3">
                  {result && (
                    <span className={`text-sm font-medium ${
                      result.includes("success") ? "text-green-400" : "text-red-400"
                    }`}>{result}</span>
                  )}
                  {editingProject && (
                    <div className="flex items-center">
                      <div className="relative inline-flex items-center gap-2 px-4 py-1.5 pr-5 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary group w-[390px]">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
                        <span className="font-medium text-sm">Editing:</span>
                        <span className="truncate text-sm">
                          {editingProject.title}
                        </span>
                        {autoSaveStatus && (
                          <span className="ml-auto text-xs text-foreground/60">
                            {autoSaveStatus}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
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
                  robloxMarketplaceUrl={robloxMarketplaceUrl || undefined}
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
