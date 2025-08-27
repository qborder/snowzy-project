import { NextResponse } from "next/server"
import { getFileByName } from "@/lib/file-storage"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    console.log(`[File Retrieval] Requesting file: ${filename}`)
    console.log(`[File Retrieval] Environment check - VERCEL: ${!!process.env.VERCEL}, KV_REST_API_URL: ${!!process.env.KV_REST_API_URL}`)
    
    const fileData = await getFileByName(filename)
    console.log(`[File Retrieval] File lookup result:`, fileData ? 'Found' : 'Not found')
    
    if (!fileData) {
      console.log(`[File Retrieval] File not found in storage: ${filename}`)
      return NextResponse.json({ 
        error: "File not found", 
        filename,
        timestamp: new Date().toISOString()
      }, { status: 404 })
    }
    
    console.log(`[File Retrieval] Found file data, fetching from blob: ${fileData.blobUrl}`)
    const blobResponse = await fetch(fileData.blobUrl)
    
    if (!blobResponse.ok) {
      console.error(`[File Retrieval] Blob fetch failed: ${blobResponse.status} ${blobResponse.statusText}`)
      return NextResponse.json({ 
        error: "Failed to fetch file from storage", 
        blobStatus: blobResponse.status,
        timestamp: new Date().toISOString()
      }, { status: 502 })
    }
    
    const contentType = fileData.mimeType || blobResponse.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await blobResponse.arrayBuffer()
    console.log(`[File Retrieval] Successfully retrieved file: ${filename}, size: ${arrayBuffer.byteLength}`)
    
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
    console.error('[File Retrieval] File retrieval failed with error:', error)
    console.error('[File Retrieval] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ 
      error: "File retrieval failed", 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

