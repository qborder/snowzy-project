export interface Project {
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
  views?: number
  downloads?: number
  content?: string
  titleColor?: string
  titleGradient?: {
    from: string
    to: string
    via?: string
  }
}

export interface ProjectCardProps {
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
  reduce?: boolean
  projectId?: string
  views?: number
  downloads?: number
  projectIndex?: number
  cardGradient?: string
  cardColor?: string
  titleColor?: string
  titleGradient?: {
    from: string
    to: string
    via?: string
  }
}

export interface ProjectEditorProps {
  onEditProject?: (projectId: string, project: Project) => void
  handleEditProject?: (project: Project) => void
}
