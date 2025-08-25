import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { generateProjectId } from "@/lib/project-utils"
import fallbackProjects from "@/data/projects.json"

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
    
    const projectsWithDefaults = projects.map((project: Project) => ({
      ...project,
      views: project.views || 0,
      downloads: project.downloads || 0
    }))
    
    return NextResponse.json(projectsWithDefaults)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json(fallbackProjects.map((project: Project) => ({
      ...project,
      views: project.views || 0,
      downloads: project.downloads || 0
    })))
  }
}

export async function POST(request: Request) {
  //if (process.env.NODE_ENV !== "development") {
    //return NextResponse.json({ error: "Not allowed" }, { status: 403 })
  //}

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { title, description, category, downloadUrl, githubUrl, demoUrl, youtubeUrl, image, icon, tags, cardGradient, cardColor, content } = body || {}
  if (!title || !description || !category || !Array.isArray(tags)) {
    return NextResponse.json({ error: "Missing required fields: title, description, category, tags[]" }, { status: 400 })
  }

  const project: Record<string, unknown> = { 
    id: generateProjectId(),
    title, 
    description, 
    category, 
    tags,
    createdAt: new Date().toISOString()
  }
  if (downloadUrl) project.downloadUrl = downloadUrl
  if (githubUrl) project.githubUrl = githubUrl
  if (demoUrl) project.demoUrl = demoUrl
  if (youtubeUrl) project.youtubeUrl = youtubeUrl
  if (image) project.image = image
  if (icon) project.icon = icon
  if (cardGradient) project.cardGradient = cardGradient
  if (cardColor) project.cardColor = cardColor
  if (content) project.content = content

  try {
    const projects = (await kv.get('projects') as Record<string, unknown>[]) || []
    projects.unshift(project)
    await kv.set('projects', projects)
    return NextResponse.json({ ok: true, project })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Expected array of projects" }, { status: 400 })
  }

  try {
    await kv.set('projects', body)
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
