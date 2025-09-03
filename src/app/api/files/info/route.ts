import { NextResponse } from "next/server"
import { getFileByName } from "@/lib/file-storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json({ 
        error: "Filename parameter required" 
      }, { status: 400 })
    }
    
    const fileData = await getFileByName(decodeURIComponent(filename))
    
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
