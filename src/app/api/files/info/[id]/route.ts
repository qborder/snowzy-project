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
      return NextResponse.json({ 
        error: "File not found" 
      }, { status: 404 })
    }
    
    return NextResponse.json({
      id: fileData.id,
      originalName: fileData.originalName,
      displayName: fileData.displayName,
      mimeType: fileData.mimeType,
      fileSize: fileData.fileSize,
      uploadedAt: fileData.uploadedAt,
      contentHash: fileData.contentHash
    })
  } catch (error) {
    console.error('[File Info] Failed to get file info:', error)
    return NextResponse.json({ 
      error: "Failed to get file info" 
    }, { status: 500 })
  }
}
