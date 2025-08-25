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
    
    return NextResponse.redirect(fileData.blobUrl)
  } catch (error) {
    console.error('File retrieval failed:', error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

