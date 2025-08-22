import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    const blob = await put(file.name || "upload.bin", file, {
      access: "public",
      contentType: file.type || undefined,
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
    return NextResponse.json({ url: blob.url }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
