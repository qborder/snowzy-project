import { NextResponse } from "next/server"
import { listFiles, getFileByName } from "@/lib/file-storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")
    
    if (filename) {
      console.log(`[Debug] Looking up specific file: ${filename}`)
      const fileData = await getFileByName(filename)
      return NextResponse.json({
        filename,
        found: !!fileData,
        data: fileData,
        timestamp: new Date().toISOString()
      })
    }
    
    console.log(`[Debug] Listing all files`)
    const files = await listFiles()
    
    return NextResponse.json({
      totalFiles: files.length,
      files: files.map(f => ({
        id: f.id,
        originalName: f.originalName,
        displayName: f.displayName,
        blobUrl: f.blobUrl,
        uploadedAt: f.uploadedAt,
        fileSize: f.fileSize
      })),
      environment: {
        vercel: !!process.env.VERCEL,
        kvAvailable: !!process.env.KV_REST_API_URL
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Debug] Debug endpoint failed:', error)
    return NextResponse.json({ 
      error: "Debug failed", 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
