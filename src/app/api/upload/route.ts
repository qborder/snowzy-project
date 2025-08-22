import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const blob = await put(file.name || "upload.bin", buffer, { access: "public" })
    return NextResponse.json({ url: blob.url }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
