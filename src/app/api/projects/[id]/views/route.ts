import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import fallbackProjects from '@/data/projects.json'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id
    
    let projects = (await kv.get('projects') as any[]) || fallbackProjects
    
    const projectIndex = projects.findIndex((p: any) => p.id === projectId)
    
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
