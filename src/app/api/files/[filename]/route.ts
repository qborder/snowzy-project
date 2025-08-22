import { NextResponse } from "next/server"

const FILE_MAP: Record<string, string> = {}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const blobUrl = FILE_MAP[filename]
    
    if (!blobUrl) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    
    return NextResponse.redirect(blobUrl)
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export function addFileMapping(filename: string, blobUrl: string) {
  FILE_MAP[filename] = blobUrl
}
