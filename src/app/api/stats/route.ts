import { NextResponse } from 'next/server'
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

export async function GET() {
  try {
    const projects = (await kv.get('projects') as Project[]) || fallbackProjects
    
    const totalDownloads = projects.reduce((total, project) => {
      return total + (project.downloads || 0)
    }, 0)
    
    const totalViews = projects.reduce((total, project) => {
      return total + (project.views || 0)
    }, 0)
    
    return NextResponse.json({
      totalProjects: projects.length,
      totalDownloads,
      totalViews
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({
      totalProjects: fallbackProjects.length,
      totalDownloads: 0,
      totalViews: 0
    })
  }
}
