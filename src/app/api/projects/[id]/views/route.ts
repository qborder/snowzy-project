import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import fallbackProjects from '@/data/projects.json'

interface Project {
  id: string
  title: string
  description: string
  category: string
  views?: number
  downloads?: number
  icon?: string
  [key: string]: unknown
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    
    const projects = (await kv.get('projects') as Project[]) || fallbackProjects
    
    const projectIndex = projects.findIndex((p: Project) => p.id === projectId)
    
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    projects[projectIndex].views = (projects[projectIndex].views || 0) + 1
    
    await kv.set('projects', projects)
    
    return NextResponse.json({ 
      success: true, 
      views: projects[projectIndex].views 
    })
    
  } catch (error) {
    console.error('Failed to increment views:', error)
    return NextResponse.json(
      { error: 'Failed to increment views' }, 
      { status: 500 }
    )
  }
}
