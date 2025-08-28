import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import fallbackProjects from "@/data/projects.json"
import { Project } from "@/types/project"

export async function POST() {
  try {
    const projects = (await kv.get('projects') as Project[]) || fallbackProjects
    
    const updatedProjects = projects.map((project: Project) => ({
      ...project,
      views: 0,
      downloads: 0
    }))
    
    await kv.set('projects', updatedProjects)
    return NextResponse.json({ ok: true, message: "All project data reset successfully" })
  } catch (error) {
    console.error('Failed to reset all project data:', error)
    return NextResponse.json({ error: "Failed to reset all project data" }, { status: 500 })
  }
}
