import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { storeFile } from "@/lib/file-storage"

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")
    if (!filename) {
      return NextResponse.json({ error: "No filename provided" }, { status: 400 })
    }
    if (!request.body) {
      return NextResponse.json({ error: "No file body provided" }, { status: 400 })
    }
    
    console.log(`[Upload] Starting upload for file: ${filename}`)
    console.log(`[Upload] Environment check - VERCEL: ${!!process.env.VERCEL}, KV_REST_API_URL: ${!!process.env.KV_REST_API_URL}`)
    
    const fileBuffer = Buffer.from(await request.arrayBuffer())
    console.log(`[Upload] File buffer size: ${fileBuffer.length} bytes`)
    
    const blob = await put(filename, fileBuffer, {
      access: "public",
      addRandomSuffix: true
    })
    console.log(`[Upload] Blob upload successful: ${blob.url}`)
    
    const result = await storeFile({
      filename,
      blobUrl: blob.url,
      mimeType: request.headers.get('content-type') || undefined,
      fileSize: fileBuffer.length,
      content: fileBuffer
    })
    console.log(`[Upload] File storage successful: ${result.id} -> ${result.displayName}`)
    
    const baseUrl = new URL(request.url).origin
    
    return NextResponse.json({
      success: true,
      id: result.id,
      filename: result.displayName,
      url: `${baseUrl}${result.downloadUrl}`,
      size: fileBuffer.length,
      uploadedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Upload] Upload failed with error:', error)
    console.error('[Upload] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: "Upload failed", 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
