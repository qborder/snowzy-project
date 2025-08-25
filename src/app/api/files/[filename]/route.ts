import { NextResponse } from "next/server"
import { getFileByName } from "@/lib/file-storage"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const fileData = await getFileByName(filename)
    
    if (!fileData) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    
    const blobResponse = await fetch(fileData.blobUrl)
    
    if (!blobResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 })
    }
    
    const contentType = fileData.mimeType || blobResponse.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await blobResponse.arrayBuffer()
    
    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': arrayBuffer.byteLength.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${fileData.originalName}"`
      }
    })
  } catch (error) {
    console.error('File retrieval failed:', error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

