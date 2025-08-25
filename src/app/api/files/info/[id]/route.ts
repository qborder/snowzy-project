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
    
    return NextResponse.json({
      id,
      originalName: fileMapping.originalName,
      slugifiedName: fileMapping.slugifiedName,
      fileSize: fileMapping.fileSize,
      mimeType: fileMapping.mimeType,
      uploadedAt: fileMapping.uploadedAt,
      downloadUrl: fileMapping.customUrl
    })
  } catch (error) {
    console.error('File info error:', error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
