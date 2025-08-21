"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Search, Eye, Download, ExternalLink, Grid, List, Trash2, Github } from "lucide-react"
import Link from "next/link"

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
  tags: string[]
  createdAt?: string
}

type ProjectEditorProps = {
  onEditProject?: (projectId: string, project: Project) => void
  handleEditProject?: (project: Project) => void
}

export function ProjectEditor({ onEditProject, handleEditProject }: ProjectEditorProps = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [editForm, setEditForm] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error('Failed to fetch projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(projects.map(p => p.category)))

  function toggleProjectSelection(projectId: string) {
    const newSelected = new Set(selectedProjects)
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId)
    } else {
      newSelected.add(projectId)
    }
    setSelectedProjects(newSelected)
  }

  function selectAllProjects() {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set())
    } else {
      setSelectedProjects(new Set(filteredProjects.map(project => project.id).filter(Boolean) as string[]))
    }
  }

  function startEditing(projectId: string) {
    const project = projects.find(p => p.id === projectId)
    if (!project) return
    if (onEditProject) {
      onEditProject(projectId, project)
    } else {
      setEditForm({ ...project })
      setEditingProject(projectId)
    }
  }

  function cancelEditing() {
    setEditForm(null)
    setEditingProject(null)
  }

  async function saveEdit() {
    if (!editForm || editingProject === null) return

    try {
      const projectIndex = projects.findIndex(p => p.id === editingProject)
      
      if (projectIndex === -1) {
        console.error("Project to edit not found in the main list.")
        return
      }

      const updatedProjects = [...projects]
      updatedProjects[projectIndex] = editForm
      
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProjects)
      })

      if (!response.ok) throw new Error('Failed to update project')
      
      setProjects(updatedProjects)
      setEditForm(null)
      setEditingProject(null)
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Failed to update project')
    }
  }

  async function deleteSelectedProjects() {
    if (selectedProjects.size === 0) return
    
    const confirmed = confirm(`Delete ${selectedProjects.size} project(s)? This cannot be undone.`)
    if (!confirmed) return

    try {
      const projectIdsToDelete = Array.from(selectedProjects)
      const updatedProjects = projects.filter(p => !projectIdsToDelete.includes(p.id || ""))
      
      const response = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProjects)
      })

      if (!response.ok) throw new Error('Failed to delete projects')
      
      setProjects(updatedProjects)
      setSelectedProjects(new Set())
    } catch (error) {
      console.error('Error deleting projects:', error)
      alert('Failed to delete projects')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/3"></div>
          <div className="h-32 bg-white/10 rounded"></div>
          <div className="h-32 bg-white/10 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Project Editor
          </CardTitle>
          <CardDescription>
            Manage your existing projects - edit, delete, or organize your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <EnhancedInput
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search projects..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex bg-muted/50 rounded-lg p-1 backdrop-blur-sm border">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-md transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-background shadow-sm" 
                      : "hover:bg-background/50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-background shadow-sm" 
                      : "hover:bg-background/50"
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects found</p>
              <p className="text-sm text-muted-foreground">Create your first project using the Project Creator tab</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedProjects.size === filteredProjects.length && filteredProjects.length > 0}
                      onCheckedChange={selectAllProjects}
                    />
                    <span className="text-sm text-muted-foreground">
                      {selectedProjects.size > 0 
                        ? `${selectedProjects.size} selected` 
                        : `${filteredProjects.length} projects`}
                    </span>
                  </div>
                </div>
                
                {selectedProjects.size > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={deleteSelectedProjects}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedProjects.size})
                    </Button>
                  </div>
                )}
              </div>

              {viewMode === "list" ? (
                <div className="grid gap-4">
                  {filteredProjects.map((project, index) => (
                    <Card key={project.id || index} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedProjects.has(project.id || "")}
                            onCheckedChange={() => toggleProjectSelection(project.id || "")}
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{project.title}</h3>
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {project.category}
                                </Badge>
                              </div>
                              <div className="flex gap-1">
                                {project.downloadUrl && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={project.downloadUrl} target="_blank">
                                      <Download className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                )}
                                {project.githubUrl && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={project.githubUrl} target="_blank">
                                      <Github className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                )}
                                {project.demoUrl && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <Link href={project.demoUrl} target="_blank">
                                      <ExternalLink className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.tags.slice(0, 6).map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 6 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.tags.length - 6}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-muted-foreground">
                                {project.createdAt && new Date(project.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startEditing(project.id || "")}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                >
                                  <Link href={project.id ? `/projects/${project.id}/${project.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}` : "#"}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project, index) => (
                    <Card key={project.id || index} className="relative group hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="absolute top-3 left-3 z-10">
                          <Checkbox
                            checked={selectedProjects.has(project.id || "")}
                            onCheckedChange={() => toggleProjectSelection(project.id || "")}
                            className="bg-background/80 backdrop-blur-sm"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start justify-between pt-6">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base line-clamp-1 mb-1">{project.title}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {project.category}
                              </Badge>
                            </div>
                            <div className="flex gap-1 ml-2">
                              {project.downloadUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={project.downloadUrl} target="_blank">
                                    <Download className="h-3 w-3" />
                                  </Link>
                                </Button>
                              )}
                              {project.githubUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={project.githubUrl} target="_blank">
                                    <Github className="h-3 w-3" />
                                  </Link>
                                </Button>
                              )}
                              {project.demoUrl && (
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={project.demoUrl} target="_blank">
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm line-clamp-3">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 4).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.tags.length - 4}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between pt-2">
                            <div className="text-xs text-muted-foreground">
                              {project.createdAt && new Date(project.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(project.id || "")}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <Link href={project.id ? `/projects/${project.id}/${project.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}` : "#"}>
                                  <Eye className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {!onEditProject && editForm && editingProject !== null && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
            <CardDescription>Make changes to your project details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <EnhancedInput
                  value={editForm.title}
                  onChange={e => setEditForm({...editForm, title: e.target.value})}
                  placeholder="Project title"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <EnhancedInput
                  value={editForm.category}
                  onChange={e => setEditForm({...editForm, category: e.target.value})}
                  placeholder="Project category"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <textarea
                value={editForm.description}
                onChange={e => setEditForm({...editForm, description: e.target.value})}
                placeholder="Project description"
                className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-background text-sm resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Download URL</label>
                <EnhancedInput
                  value={editForm.downloadUrl || ""}
                  onChange={e => setEditForm({...editForm, downloadUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">GitHub URL</label>
                <EnhancedInput
                  value={editForm.githubUrl || ""}
                  onChange={e => setEditForm({...editForm, githubUrl: e.target.value})}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Demo URL</label>
                <EnhancedInput
                  value={editForm.demoUrl || ""}
                  onChange={e => setEditForm({...editForm, demoUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">YouTube URL</label>
                <EnhancedInput
                  value={editForm.youtubeUrl || ""}
                  onChange={e => setEditForm({...editForm, youtubeUrl: e.target.value})}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tags (comma separated)</label>
              <EnhancedInput
                value={editForm.tags.join(", ")}
                onChange={e => setEditForm({...editForm, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)})}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelEditing}>
                Cancel
              </Button>
              <Button onClick={saveEdit}>
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
