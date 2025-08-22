import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

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
    return NextResponse.json(blob)
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
