import { NextResponse } from "next/server"
import { getFileById } from "@/lib/file-storage"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fileData = await getFileById(id)
    
    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    
    return NextResponse.redirect(fileData.blobUrl)
  } catch (error) {
    console.error('File download failed:', error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
