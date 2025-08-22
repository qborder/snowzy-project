import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { generateCustomUrl, storeFileMapping } from "@/lib/file-storage"

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
    const blob = await put(filename, request.body, {
      access: "public",
      addRandomSuffix: true
    })
    const customId = generateCustomUrl(filename)
    const customUrl = storeFileMapping(customId, blob.url, filename)
    const baseUrl = new URL(request.url).origin
    return NextResponse.json({
      ...blob,
      url: `${baseUrl}${customUrl}`
    })
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
