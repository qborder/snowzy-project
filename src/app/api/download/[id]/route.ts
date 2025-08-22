import { NextResponse } from "next/server"
import { getFileMapping } from "@/lib/file-storage"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fileMapping = getFileMapping(id)
    
    if (!fileMapping) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    
    return NextResponse.redirect(fileMapping.blobUrl)
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
