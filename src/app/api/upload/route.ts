import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { storeFileMapping } from "@/lib/file-storage"

function generateFileHash(content: ArrayBuffer): string {
  const array = new Uint8Array(content)
  let hash = 0
  for (let i = 0; i < array.length; i++) {
    const char = array[i]
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")
    const contentType = request.headers.get("content-type")
    
    if (!filename) {
      return NextResponse.json({ error: "No filename provided" }, { status: 400 })
    }
    if (!request.body) {
      return NextResponse.json({ error: "No file body provided" }, { status: 400 })
    }

    const bodyBuffer = await request.arrayBuffer()
    const fileSize = bodyBuffer.byteLength
    const contentHash = generateFileHash(bodyBuffer)
    
    // Check for duplicates first
    const duplicateCheck = storeFileMapping(
      filename,
      "",
      fileSize,
      contentType || undefined,
      contentHash
    )
    
    if (duplicateCheck.isExisting) {
      const baseUrl = new URL(request.url).origin
      return NextResponse.json({
        url: `${baseUrl}${duplicateCheck.customUrl}`,
        filename: filename,
        size: fileSize,
        type: contentType,
        uploadedAt: new Date().toISOString(),
        isDuplicate: true,
        message: "File already exists, returning existing file"
      })
    }
    
    // Upload new file
    const blob = await put(filename, bodyBuffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: contentType || undefined
    })
    
    // Update the mapping with the blob URL
    const finalResult = storeFileMapping(
      filename,
      blob.url,
      fileSize,
      contentType || undefined,
      contentHash
    )
    
    const baseUrl = new URL(request.url).origin
    
    return NextResponse.json({
      url: `${baseUrl}${finalResult.customUrl}`,
      filename: filename,
      size: fileSize,
      type: contentType,
      uploadedAt: new Date().toISOString(),
      isDuplicate: false
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
