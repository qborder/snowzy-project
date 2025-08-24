"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { EnhancedInput } from "@/components/ui/enhanced-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Search, Eye, Download, ExternalLink, Trash2, Github, Calendar, Tag, Filter, SortAsc, SortDesc, Sparkles, Clock } from "lucide-react"
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
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'category'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [editingProject, setEditingProject] = useState<string | null>(null)
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

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'date':
          comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
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
    if (selectedProjects.size === filteredAndSortedProjects.length) {
      setSelectedProjects(new Set())
    } else {
      setSelectedProjects(new Set(filteredAndSortedProjects.map(project => project.id).filter(Boolean) as string[]))
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading your projects...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-xl">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Project Manager
            </h2>
            <p className="text-muted-foreground">Manage and organize your project portfolio</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <EnhancedInput
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search projects, tags, or descriptions..."
              className="pl-10 bg-background/60 backdrop-blur-sm border-white/20"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-background/60 backdrop-blur-sm border-white/20">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'title' | 'date' | 'category')}>
              <SelectTrigger className="bg-background/60 backdrop-blur-sm border-white/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Created</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-background/60 backdrop-blur-sm border-white/20"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="p-4 bg-muted/20 rounded-full w-fit mx-auto mb-4">
              <Edit className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first project to get started</p>
            <Button asChild>
              <Link href="/dev/projects">Create Project</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between bg-background/40 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedProjects.size === filteredAndSortedProjects.length && filteredAndSortedProjects.length > 0}
                  onCheckedChange={selectAllProjects}
                />
                <div className="text-sm">
                  {selectedProjects.size > 0 ? (
                    <span className="font-medium text-primary">
                      {selectedProjects.size} selected
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {filteredAndSortedProjects.length} projects
                    </span>
                  )}
                </div>
              </div>
              
              {selectedProjects.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={deleteSelectedProjects}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete {selectedProjects.size}
                </Button>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredAndSortedProjects.map((project, index) => (
                <Card key={project.id || index} className="group relative overflow-hidden bg-gradient-to-br from-background/90 to-background/50 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-6">
                    <div className="absolute top-4 left-4">
                      <Checkbox
                        checked={selectedProjects.has(project.id || "")}
                        onCheckedChange={() => toggleProjectSelection(project.id || "")}
                        className="bg-background/80 backdrop-blur-sm"
                      />
                    </div>
                    
                    <div className="pt-8 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                              {project.category}
                            </Badge>
                            {project.createdAt && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(project.createdAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {project.tags.slice(0, 4).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs bg-background/50 hover:bg-primary/10 transition-colors">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div className="flex gap-1">
                          {project.downloadUrl && (
                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 hover:bg-primary/10">
                              <Link href={project.downloadUrl} target="_blank">
                                <Download className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 hover:bg-primary/10">
                              <Link href={project.githubUrl} target="_blank">
                                <Github className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          {project.demoUrl && (
                            <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 hover:bg-primary/10">
                              <Link href={project.demoUrl} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(project.id || "")}
                            className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:bg-primary/10"
                          >
                            <Link href={project.id ? `/projects/${project.id}/${project.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}` : "#"}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

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
