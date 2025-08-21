import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET() {
  const filePath = path.join(process.cwd(), "src", "data", "projects.json")
  
  try {
    const data = await fs.readFile(filePath, "utf8")
    const projects = JSON.parse(data)
    return NextResponse.json(projects)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to read projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { title, description, category, downloadUrl, githubUrl, demoUrl, youtubeUrl, image, tags } = body || {}
  if (!title || !description || !category || !Array.isArray(tags)) {
    return NextResponse.json({ error: "Missing required fields: title, description, category, tags[]" }, { status: 400 })
  }

  const project: any = { title, description, category, tags }
  if (downloadUrl) project.downloadUrl = downloadUrl
  if (githubUrl) project.githubUrl = githubUrl
  if (demoUrl) project.demoUrl = demoUrl
  if (youtubeUrl) project.youtubeUrl = youtubeUrl
  if (image) project.image = image

  const filePath = path.join(process.cwd(), "src", "data", "projects.json")

  try {
    const current = await fs.readFile(filePath, "utf8")
    const arr = JSON.parse(current)
    if (!Array.isArray(arr)) throw new Error("Invalid projects.json")
    arr.unshift(project)
    const pretty = JSON.stringify(arr, null, 2) + "\n"
    await fs.writeFile(filePath, pretty, "utf8")
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Write failed" }, { status: 500 })
  }
}
